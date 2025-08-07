import axios from 'axios';

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