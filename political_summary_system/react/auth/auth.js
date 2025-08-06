import axios from 'axios'


// 세션 객체를 받아오는 함수
export async function getSession(){
    const user = await axios.get('http://localhost:8000',{withCredentials : true})
                            .then((res)=>{
                                // alert(res.data);
                                // alert(res.status);
                                // alert(res.headers);
                                return res.data; // 세션 객체가 전달됨
                            })
    return user;
}