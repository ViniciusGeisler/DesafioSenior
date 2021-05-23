import { Request, Response } from "express";
import db from "../database/connection";
import IdFinder from "../utils/IdFinder";

class MaterialController {
    async create(request: Request, response: Response) {
        const { code, name } = request.body;

        if (!code) {
            return response
                .status(400)
                .send({ Mensagem: "O campo código é obrigatório" });
        }

        if (!name) {
            return response
                .status(400)
                .send({ Mensagem: "O campo nome é obrigatório" });
        }

        db("material")
            .insert({ code, name })
            .then((ids) => {
                return response.send({
                    id: ids[0],
                    code,
                    name,
                });
            })
            .catch((err) => {
                return response
                    .status(500)
                    .send({ Mensagem: "Falha ao criar Material" });
            });
    }

    async index(request: Request, response: Response) {
        const material = await db("material").select("*");

        if (!material) {
            return response
                .status(400)
                .send({ Mensagem: "Nenhum material encontrado!" });
        }

        return response.send({ material });
    }

    async findByCode(request: Request, response: Response) {
        const { code } = request.params;

        const material = await db("material")
            .select("*")
            .where("code", "=", code);

        if (!material) {
            return response
                .status(400)
                .send({ Mensagem: "Nenhum material encontrado!" });
        }

        return response.send({ material: material[0] });
    }

    async update(request: Request, response: Response) {
        const { code, name } = request.body;
        const { codeFromUrl } = request.params;

        if (!codeFromUrl) {
            return response
                .status(400)
                .send({ Mensagem: "Material não encontrado!" });
        }

        if (!code) {
            return response
                .status(400)
                .send({ Mensagem: "O campo código é obrigatório!" });
        }

        if (!name) {
            return response
                .status(400)
                .send({ Mensagem: "O campo nome é obrigatório!" });
        }

        db("material")
            .where("code", "=", codeFromUrl)
            .update({ code, name })
            .then((id) => {
                return response.send({
                    id,
                    code,
                    name,
                });
            })
            .catch((err) => {
                return response
                    .status(500)
                    .send({ Mensagem: "Falha ao atualizar Material!" });
            });
    }

    async delete(request: Request, response: Response) {
        const { code } = request.params;

        const materialId = await IdFinder.findMaterialId(Number(code));

        const requestItem = await db("request_item")
            .delete()
            .where("material_id", "=", materialId);

        const material = await db("material").delete().where("code", "=", code);

        if (!material || !requestItem) {
            return response.status(400).send({ Mensagem: "Falha ao exlcuir" });
        }

        return response.status(204).send();
    }
}

export default MaterialController;
