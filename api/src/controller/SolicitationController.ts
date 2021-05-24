import { Request, Response } from "express";
import db from "../database/connection";
import IdFinder from "../utils/IdFinder";

class SolicitationController {
    async create(request: Request, response: Response) {
        const { solicitationNumber, requesterName } = request.body;

        if (!solicitationNumber) {
            return response.status(400).send({
                Mensagem: "O campo número da solicitação é obrigatório",
            });
        }

        if (!requesterName) {
            return response.status(400).send({
                Mensagem: "O campo nome do solicitante é obrigatório",
            });
        }

        db("solicitation")
            .insert({ solicitationNumber, requesterName })
            .then((ids) => {
                return response.send({
                    id: ids[0],
                    solicitationNumber,
                    requesterName,
                    issueDate: new Date().toISOString().split("T")[0],
                });
            })
            .catch((err) => {
                return response
                    .status(500)
                    .send({ Mensagem: "Falha ao criar Solicitação" });
            });
    }

    async index(request: Request, response: Response) {
        const solicitation = await db("solicitation").select("*");

        if (!solicitation) {
            return response
                .status(400)
                .send({ Mensagem: "Nenhuma solicitação encontrada!" });
        }

        return response.send({ solicitation });
    }

    async findBySolicitationNumber(request: Request, response: Response) {
        const { solicitationNumber } = request.params;

        const solicitation = await db("solicitation")
            .select("*")
            .where("solicitationNumber", "=", solicitationNumber);

        if (!solicitation) {
            return response
                .status(400)
                .send({ Mensagem: "Nenhuma solicitação encontrada!" });
        }

        return response.send({ solicitation: solicitation[0] });
    }

    async update(request: Request, response: Response) {
        const { solicitationNumber, requesterName } = request.body;
        const { solicitationNumberFromUrl } = request.params;

        if (!solicitationNumberFromUrl) {
            return response
                .status(400)
                .send({ Mensagem: "Solicitação não encontrado!" });
        }

        if (!solicitationNumber) {
            return response.status(400).send({
                Mensagem: "O campo número da solicitação é obrigatório!",
            });
        }

        if (!requesterName) {
            return response.status(400).send({
                Mensagem: "O campo nome do solicitante é obrigatório!",
            });
        }

        db("solicitation")
            .where("solicitationNumber", "=", solicitationNumberFromUrl)
            .update({ solicitationNumber, requesterName })
            .then((id) => {
                return response.send({
                    id,
                    solicitationNumber,
                    requesterName,
                });
            })
            .catch((err) => {
                return response
                    .status(500)
                    .send({ Mensagem: "Falha ao atualizar solicitação" });
            });
    }

    async delete(request: Request, response: Response) {
        const { solicitationNumber } = request.params;

        const solicitationId = await IdFinder.findSolicitationId(
            Number(solicitationNumber)
        );

        const requestItem = await db("request_item")
            .delete()
            .where("solicitation_id", "=", solicitationId);

        const solicitation = await db("solicitation")
            .delete()
            .where("solicitationNumber", "=", solicitationNumber);

        if (!solicitation) {
            return response
                .status(400)
                .send({ Mensagem: "Falha ao exlcuir solicitação" });
        }

        return response.status(204).send();
    }
}

export default SolicitationController;
