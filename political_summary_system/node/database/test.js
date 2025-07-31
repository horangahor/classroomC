const { insertMember, removeMember, getMemberByName } = require("./query");

(async () => {
    // 테스트용 데이터 추가
    await insertMember("김관영", 55, "전북특별자치도지사", "더불어민주당");

    // 조회 테스트
    const members = await getMemberByName("김관영");
    if (members.length > 0) {
        console.log("조회 성공:", members);
    } else {
        console.log("조회 실패 or 해당 이름 없음");
    }

    // 삭제 테스트
    const deletedCount = await removeMember("김관영")

    if (deletedCount > 0) {
        console.log("삭제 성공");
    } else {
        console.log("삭제 실패 or 해당 이름 없음");
    }
})();