import React, { useState } from 'react';
import axios from 'axios';
import '../style/Upload.css'

// FileUpload 컴포넌트는 파일 업로드 기능을 제공합니다.
const FileUpload = () => {
  // 1. 상태 변수 정의
  //    - selectedFile: 사용자가 선택한 파일 객체
  //    - uploadProgress: 파일 업로드 진행률 (0% ~ 100%)
  //    - message: 업로드 결과 또는 오류 메시지
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  // 2. 파일 선택 핸들러
  //    - 파일 입력(input type="file")에서 파일이 선택될 때 호출됩니다.
  const handleFileChange = (event) => {
    // 선택된 첫 번째 파일을 selectedFile 상태에 저장합니다.
    setSelectedFile(event.target.files[0]);
    // 메시지와 진행률을 초기화합니다.
    setMessage('');
    setUploadProgress(0);
  };

  // 3. 파일 업로드 핸들러
  //    - "업로드" 버튼을 클릭할 때 호출됩니다.
  const handleFileUpload = async () => {
    // 파일이 선택되지 않았다면 경고 메시지를 표시하고 함수를 종료합니다.
    if (!selectedFile) {
      setMessage('파일을 먼저 선택해주세요.');
      return;
    }

    // FormData 객체 생성: 파일을 서버로 전송하기 위한 표준 웹 API 객체입니다.
    const formData = new FormData();
    // 'file'이라는 이름으로 선택된 파일을 FormData에 추가합니다.
    formData.append('file', selectedFile);

    try {
      // Axios를 사용하여 파일 업로드 요청을 서버로 보냅니다.
      // 'http://localhost:5000/upload'는 실제 백엔드 API 주소로 변경해야 합니다.
      const response = await axios.post('http://localhost:8000/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수 헤더
        },
        // onUploadProgress: 파일 업로드 진행 상황을 실시간으로 추적하는 콜백 함수
        onUploadProgress: (progressEvent) => {
          // 업로드된 바이트 수와 총 바이트 수를 사용하여 진행률을 계산합니다.
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // 진행률 상태 업데이트
        },
      });

      // 업로드 성공 시 메시지를 설정하고 진행률을 100%로 완료합니다.
      setMessage(`파일 업로드 성공: ${response.data.message}`);
      setUploadProgress(100);
    } catch (error) {
      // 업로드 실패 시 에러 메시지를 설정하고 진행률을 초기화합니다.
      setMessage(`파일 업로드 실패: ${error.response?.data?.message || error.message}`);
      setUploadProgress(0);
    }
  };

  return (
    // 전체 페이지 레이아웃
    <div className="upload-page-container">
      {/* 파일 업로드 카드 */}
      <div className="upload-card">
        <h2 className="upload-title">파일 업로드</h2>

        {/* 파일 선택 input 필드 */}
        <div className="input-margin-bottom">
          <label htmlFor="file-input" className="file-label">
            파일 선택:
          </label >
          <input
            id="file-input"
            type="file"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* 업로드 버튼 */}
        <button
          className="upload-button"
          onClick={handleFileUpload}
          disabled={!selectedFile} // 파일이 선택되지 않으면 버튼 비활성화
        >
          업로드
        </button>

        {/* 진행 상황 표시 (업로드 중일 때만 보임) */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div>
            <div>
              <div
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>{uploadProgress}% 완료</p>
          </div>
        )}

        {/* 결과 메시지 표시 (메시지가 있을 때만 보임) */}
        {message && (
          <div>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
