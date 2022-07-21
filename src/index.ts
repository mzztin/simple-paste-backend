import "dotenv/config";
import "module-alias/register";

import fastify, {FastifyRequest} from "fastify";
import {z} from "zod";
import {db} from "./db";
import {
    createOne,
    createTable,
    findOne,
    getLast,
    importModules,
} from "./queries";

const app = fastify();

app.get("/", async (_, res) => {
    const data = await getLast();

    res.status(200).send({
        data,
    });
});

app.get(
    "/:id",
    async (
        req: FastifyRequest<{
            Params: {
                id: string;
            };
        }>,
        res
    ) => {
        const {id} = req.params;

        const data = await findOne(id);

        if (data === false) {
            res.status(400).send({
                error: true,
                msg: "could not find",
            });
        }

        res.status(200).send(data);
    }
);

app.post("/", async (req, res) => {
    const schema = z.object({
        author: z.string().max(32).min(2).optional(),
        title: z.string().max(32).min(2).optional(),
        private: z.boolean().optional(),
        content: z.string(),
    });

    const data = schema.safeParse(req.body);

    if (data.success === false) {
        res.status(400).send({error: true, errors: data.error.errors });
        return;
    }

    const {author, title, content} = data.data;

    const id = await createOne(
        title ?? "Untitled",
        author ?? "Authorless",
        content,
        data.data.private ?? false
    );

    if (id === false) {
        res.status(400).send({error: true, msg: "Could not execute query"});
        return;
    }

    res.status(200).send({
        msg: "successfully created a snippet",
        id,
    });
});

app.listen(
    {
        port: Number(process.env.PORT),
    },
    async (err, addr) => {
        if (err) throw err;

        db.connect().then(() => {
            importModules().then(() => {
                createTable();
            })
        });

        console.log(`Listening on ${addr}`);
    }
);

export {app};
