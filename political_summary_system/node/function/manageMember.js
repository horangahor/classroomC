const { getMember, getMemberById } = require("../database/memberQuery");

async function getMemberInfo(req, res) {
    try {
        const member = await getMember();
        if (member) {
            // 프론트가 전체 목록을 배열로 기대하므로 배열을 직접 반환
            res.json(member);
        } else {
            res.status(404).json({ errorCode: "NOT_FOUND", message: "인물 정보를 찾을 수 없습니다." });
        }
    } catch (err) {
            console.error("getMemberInfo error", err);
            res.status(500).json({ errorCode: "SERVER_ERROR", message: "에러가 발생했습니다." });
    }
}

// 새로 추가: id 기반 단일 멤버 조회 핸들러
async function getMemberByIdHandler(req, res) {
    try {
        const id = req.params.id;
        const member = await getMemberById(id);
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ errorCode: "NOT_FOUND", message: "해당 인물을 찾을 수 없습니다." });
        }
    } catch (err) {
        console.error("getMemberByIdHandler error", err);
        res.status(500).json({ errorCode: "SERVER_ERROR", message: "서버 오류가 발생했습니다." });
    }
}

module.exports = { getMemberInfo, getMemberByIdHandler };