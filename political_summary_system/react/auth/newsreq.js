import axios from 'axios';
import {getSession} from './auth';

export async function getNews(page = 1){
    const news = await axios.get("http://localhost:8000/getNews", { params : {
                                    page : page
                            }})
                            .then((res)=>{
                                return res.data;
                            })
                            .catch((err)=>{
                                console.error(err);
                            })
    return news;
}

// export async function getFavor(newsId){
//     const user = await getSession();

//         axios
//             .post('http://localhost:8000/favor',{
//                 uid : user.id,
//                 nid : newsId
//             })
//             .then (async (res) =>{
//                 console.log(res.data);
//                 return res.data;
//             })
//             .catch((err)=>{
//                 console.error(err);
//             });
// }