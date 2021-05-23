import db from "../database/connection";

class IdFinder {
    static async findMaterialId(materialCode: Number) {
        let [material] = await db("material")
            .select("id")
            .where("code", "=", materialCode);

        return material ? material.id : 0;
    }

    static async findSolicitationId(solicitationNumber: Number) {
        let [solicitation] = await db("solicitation")
            .select("id")
            .where("solicitationNumber", "=", solicitationNumber);

        return solicitation ? solicitation.id : 0;
    }
}

export default IdFinder;
