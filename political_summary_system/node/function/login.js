const express = require('query.js');
const { removeMember } = require('../database/query');

async function join(req, res) {
    // 요청데이터 가져오기(body)
    try {
        console.log(req.body);
        const { id, pw } = req.body;
        const result = await createMember(id, pw);

        console.log('result : ', result);
        if (result > 0) {
            return res.status(201).json({ success: true, message: '회원가입이 완료되었습니다. 이메일을 확인하세요.' });
        }

        // 생성되지 않은 경우 중복 또는 입력 문제로 간주
        return res.status(409).json({ errorCode: 'DUPLICATE', message: '이미 존재하는 회원입니다.' });
    } catch (err) {
        console.error('join error', err);
        return res.status(500).json({ errorCode: 'DB_ERROR', message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.' });
    }
}

// 로그인 기능
async function login(req, res) {
    const { id, pw } = req.body;
    try {
        const [result] = await loginMember(id, pw);

        if (!result) {
            return res.status(401).json({
                errorCode: 'INVALID_CREDENTIAL',
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 로그인 성공 -> 세션 저장
        req.session.loginMember = { id: result.id };

        return res.json({
            success: true,
            message: '로그인 성공',
            user: { id: result.id, name: result.name }
        });
    } catch (err) {
        console.error('login error', err);
        return res.status(500).json({
            errorCode: 'DB_ERROR',
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.'
        });
    }
}

// 회원정보 수정 기능
async function update(req, res) {
    try {
        const { id, pw } = req.body;
        const result = await updateMember(id, pw);

        if (result > 0) {
            return res.json({ success: true, message: '회원정보가 수정되었습니다.' });
        }

        return res.status(400).json({ errorCode: 'INVALID_INPUT', message: '잘못된 입력입니다.' });
    } catch (err) {
        console.error('update error', err);
        return res.status(500).json({ errorCode: 'DB_ERROR', message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.' });
    }
}

// 회원탈퇴 기능
async function remove(req, res) {
    try {
        const { id } = req.query;
        const result = await removeMember(id);

        if (result > 0) {
            return res.json({ success: true, message: '회원탈퇴가 완료되었습니다.' });
        }

        return res.status(404).json({ errorCode: 'NOT_FOUND', message: '해당 회원을 찾을 수 없습니다.' });
    } catch (err) {
        console.error('remove error', err);
        return res.status(500).json({ errorCode: 'DB_ERROR', message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.' });
    }
}