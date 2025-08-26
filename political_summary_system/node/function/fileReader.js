const { error } = require("console");
const fs  = require("fs").promises;
const path = require("path");

// 테스트용 파일 경로
const politician = path.join(__dirname, "..", "dataset", "politician_data.csv");

// 파일을 읽어서 배열로 바꾸고 반환
const readFile = async (file) => {
    
    const data = await fs.readFile(file, "utf8");
    // console.log("readFile : " , data);
    const csvData = csvToArray(data);
    // console.log("readFile의 csvData :" , csvData); // 여기까진 값이 잘 전달됨
    
    return csvData;
}  

// 읽은 csv 텍스트를 배열로 바꿈
function csvToArray(str , delimiter = ","){
    // 컬럼 줄
    const header = str.slice(0 , str.indexOf("\n")).split(delimiter);
    
    // 레코드를 한 줄 단위로 토큰화
    const rows = str.slice(str.indexOf("\n")+1).split("\n");
    
    // 정치인 객체를 저장하는 배열
    const arr = [];

    // 객체화 + 배열에 추가
    for(i = 0 ; i< rows.length; i++){
        const record =rows[i].split(delimiter);
        const obj = {
            id : record[0],
            name : record[1],
            age : record[2],
            location : record[3],
            position : record[4],
            affiliation : record[5],
            pledge : record[6],
            profile_image_url : record[7]
        }
        arr.push(obj);
    }
    // console.log("csvToArray : " , arr);
    
    return arr;
}

module.exports = {readFile};