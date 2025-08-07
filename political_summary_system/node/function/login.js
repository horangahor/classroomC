const express = require('query.js');
const { removeMember } = require('../database/query');

async function join(req, res) {
    // 요청데이터 가져오기(body)
    console.log(req.body);
    const { id, pw } = req.body;
    const result = await createMember(id, pw);

    console.log('result : ', result);
    
    if (result > 0) {
        res.redirect('/login');
    } else {
        res.redirect('/join');
    }
}

// 로그인 기능
async function login(req, res) {
    
    const { id, pw } = req.body;
    const [result] = await loginMember(id, pw);

    if (result) {
        req.session.loginMember = {
            id : result.id
        }
    }

    if (result) {
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}

// 회원정보 수정 기능
async function update(req, res) {
    const { id, pw } = req.body;
    const result = await updateMember(id, pw);
    
    if (result > 0) {
        res.redirect('/');
    } else {
        res.redirect('/update');
    }
}

// 회원탈퇴 기능
async function remove(req, res) {
    
    const { id } = req.query;
    const result = await removeMember(id);

    if (result > 0) {
        res.redirect('/join');
    } else {
        res.redirect('/');
    }
}