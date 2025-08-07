const { getMember } = require("../database/memberQuery");

async function getMemberInfo(req, res) {
    try {
        const member = await getMember();
        console.log("manageMember파일 ,  getMemberInfo함수");
        console.log(member);
        
        
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: "인물 정보를 찾을 수 없습니다." });
        }
    } catch (err) {
            res.status(500).json({ message: "에러가 발생했습니다." });
    }
}

module.exports = { getMemberInfo };