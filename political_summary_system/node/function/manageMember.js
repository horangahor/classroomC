const { getMemberById } = require("../database/memberQuery");

async function getMemberInfo(req, res, next) {
    const { id } = req.params;
    try {
        const member = await getMemberById(id);
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: "인물 정보를 찾을 수 없습니다." });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { getMemberInfo };