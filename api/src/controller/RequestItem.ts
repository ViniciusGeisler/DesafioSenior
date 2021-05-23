import { Request, Response } from "express";
import db from "../database/connection";
import IdFinder from "../utils/IdFinder";

class RequestItemController {
    async create(request: Request, response: Response) {
        const { solicitationNumber } = request.params;
        const { materialCode, amount } = request.body;

        if (!materialCode) {
            return response
                .status(400)
                .send({ Mensagem: "O campo código do material é obrigatório" });
        }

        if (!amount) {
            return response
                .status(400)
                .send({ Mensagem: "O campo quantidade é obrigatório" });
        }

        if (!solicitationNumber) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação inexistente" });
        }

        const materialId = await IdFinder.findMaterialId(materialCode)
        const solicitationId = await IdFinder.findSolicitationId(Number(solicitationNumber))

        if (!solicitationId) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação inexistente" });
        }

        const materialAlreadyExist = await RequestItemController.checkMaterialAlreadyExist(solicitationId, materialId);

        if (materialAlreadyExist) {
            return response.status(400).send({
                Mensagem: "Material já existente para essa solicitação",
            });
        }

        db("request_item")
            .insert({
                solicitation_id: solicitationId,
                material_id: materialId,
                amount,
            })
            .then((ids) => {
                return response.send({
                    id: ids[0],
                    solicitationNumber: Number(solicitationNumber),
                    materialCode,
                    amount,
                });
            })
            .catch((err) => {
                return response.status(500).send({
                    Mensagem: "Falha ao adicionar item da solicitação",
                });
            });
    }

    async findBySolicitationNumber(request: Request, response: Response) {
        const { solicitationNumber } = request.params;

        const solicitationId = await IdFinder.findSolicitationId(Number(solicitationNumber));

        const solicitationItems = await db("request_item")
            .select("*")
            .where("solicitation_id", "=", solicitationId);

        if (!solicitationItems) {
            return response
                .status(400)
                .send({ Mensagem: "Nenhum item encontrado na solicitação!" });
        }

        return response.send({ solicitationItems });
    }

    async update(request: Request, response: Response) {
        const { solicitationNumber, materialCodeFromUrl } = request.params;
        const { materialCode, amount } = request.body;

        if (!materialCode) {
            return response
                .status(400)
                .send({ Mensagem: "O campo código do material é obrigatório" });
        }

        if (!amount) {
            return response
                .status(400)
                .send({ Mensagem: "O campo quantidade é obrigatório" });
        }

        if (!solicitationNumber) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação inexistente" });
        }

        const newMaterialId = await IdFinder.findMaterialId(
            Number(materialCode)
        );
        const currentMaterialId = await IdFinder.findMaterialId(
            Number(materialCodeFromUrl)
        );
        const solicitationId = await IdFinder.findSolicitationId(
            Number(solicitationNumber)
        );

        if (!solicitationId) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação inexistente" });
        }

        if (!currentMaterialId) {
            return response
                .status(400)
                .send({ Mensagem: "O item não existe nessa solicitação" });
        }

        const isMaterialOnSolicitation = await RequestItemController.findMaterialOnSolicitation(solicitationId,currentMaterialId);
        if (isMaterialOnSolicitation) {
            return response
                .status(400)
                .send({ Mensagem: "O item não existe na solicitação" });
        }

        const materialAlreadyExist = RequestItemController.checkMaterialAlreadyExist(solicitationId, newMaterialId);
        if (materialAlreadyExist) {
            return response.status(400).send({
                Mensagem: "Material já existente para essa solicitação",
            });
        }

        db("request_item")
            .where("solicitation_id", "=", solicitationId)
            .where("material_id", "=", currentMaterialId)
            .update({
                material_id: newMaterialId,
                amount,
            })
            .then((id) => {
                return response.send({
                    id,
                    materialCode,
                    amount,
                });
            })
            .catch((err) => {
                return response
                    .status(500)
                    .send({ Mensagem: "Falha ao atualizar Material" });
            });
    }

    async delete(request: Request, response: Response) {
        const { solicitationNumber, materialCodeFromUrl } = request.params;

        const materialId = await IdFinder.findMaterialId(
            Number(materialCodeFromUrl)
        );
        if (!materialId) {
            return response
                .status(400)
                .send({ Mensagem: "Item não encontrado" });
        }

        const solicitationId = await IdFinder.findSolicitationId(
            Number(solicitationNumber)
        );
        if (!solicitationId) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação não encontrada" });
        }

        const requestItem = await db("request_item")
            .delete()
            .where("solicitation_id", "=", solicitationId)
            .where("material_id", "=", materialId);

        if (!requestItem) {
            return response.status(400).send({ Mensagem: "Falha ao exlcuir" });
        }

        return response.status(204).send();
    }

    static async findMaterialOnSolicitation(
        solicitationNumber: Number,
        materialCode: Number
    ) {
        let [item] = await db("request_item")
            .select("id")
            .where("solicitation_id", "=", solicitationNumber)
            .where("material_id", "=", materialCode);

        return item ? item.id : 0;
    }

    static async checkMaterialAlreadyExist(solicitationId: number, materialId: number) {
        const materialAlreadyExist = await db("request_item")
            .select("*")
            .where("material_id", "=", materialId)
            .where("solicitation_id", "=", solicitationId);

        return materialAlreadyExist.length
    }
}
export default RequestItemController;
