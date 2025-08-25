const express = require("express");
const router = express.Router();
const { getMemberInfo } = require("../function/manageMember");
const pool = require("../db/db") // DB 연결 모듈

// GET: 회원 목록 조회
router.get("/members", getMemberInfo);

// DELETE: 세션 기반 회원 삭제
router.delete("/members", async (req, res) => {
    const user = req.session?.user;
    const { password } = req.body;

    if (!user || (!user.name && !user.id) || !password) {
        return res.status(400).json({ message: "로그인된 사용자 정보가 없습니다." });
    }

    const identifierName = user.name || '';
    const identifierid = user.id || '';

    try {
        // 회원 정보 확인
        const [rows] = await pool.execute(
            `select * from users
             where name = ? and id = ? and password = ?`,
            [identifierName, identifierid, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "해당 사용자를 찾을 수 없습니다." });
        }

        // 삭제
        const [result] = await pool.execute(
            `delete from users 
             where name = ? and id = ? and password = ?`,
            [identifierName, identifierid, password]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "삭제 실패: 사용자 없음" })
        }

        // 세션 제거
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ message: "회원 정보가 삭제되었습니다." });
        });

    } catch (err) {
        console.error("회원 삭제 실패:", err);
        res.status(500).json({ message: "서버 오류: 삭제 실패" });
    }
});

module.exports = router;