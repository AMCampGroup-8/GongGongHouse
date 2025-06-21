import React from 'react';
import './AnnoucementDetail.css';
import { Link } from 'react-router-dom';
import back from '../../../public/images/back.png';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

function AnnouncementDetailTable({ detail, spl }) {
  console.log(detail);
  console.log(spl);
  // detail이 없으면 spl을 detail처럼 활용
  const main = detail || spl;
  const splList = spl?.dsList02 || [];
  const files = main?.dsAhflInfo || [];
  const noticeFiles = files.filter(file => file.CMN_AHFL_NM?.includes("공고"));
  const otherFiles = files.filter(file => !file.CMN_AHFL_NM?.includes("공고"));
  const TYPE_MAP = {
    "01": "토지",
    "05": "분양주택",
    "06": "임대주택",
    "13": "주거복지",
    "22": "상가",
    "39": "신혼희망타운"
  };
  return (
    <div className="detail-table-wrap">

      <h2 className="text-2xl font-bold mb-4">공고 상세</h2>
      <div className="flex justify-end">
        <Link to="/announcementlist" className="mr-4">
          <img src={back} alt="goback" className="back" />
        </Link>
      </div>
      {/* 기본 정보 섹션 */}
      <div className="detail-section detail-section--summary w-full">
        {/* 상단 요약 정보 */}
        <div className="detail-row2">
          <div className="detail-title">{main?.PAN_NM || '-'}</div>
        </div>
        <ul className="detail-row1">
          <li className="detail-label">접수상태 : {main?.PAN_SS || '-'}</li>
          <li className="detail-label">유형 : {TYPE_MAP[main?.UPP_AIS_TP_CD] || main?.UPP_AIS_TP_CD || '-'}</li>
          <li className="detail-label">공고번호 : {main?.PAN_ID || '-'}</li>
          <li className="detail-label">
            공고페이지 : {main?.DTL_URL ? (
              <Button
                onClick={() => window.open(main.DTL_URL, '_blank')}
                className="bg-[#5DC1B7] text-black cursor-pointer"
              >
                공고페이지로 이동
              </Button>
            ) : (
              <span className="no-url">URL 없음</span>
            )}
          </li>
        </ul>
      </div>

      <h3 className="detail-subtitle">공급 정보</h3>
      <Table className="table-bordered">
        <TableHeader>
          <TableRow className="table-head">
            <TableHead className="w-[150px]">시군구명</TableHead>
            <TableHead>공급호수</TableHead>
            <TableHead>주소</TableHead>
            <TableHead className="text-right">공급세대수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: "center", color: "#888", fontSize: "1.2rem", fontWeight: "bold" }}>
                이 데이터는 제공되지 않습니다.
              </TableCell>
            </TableRow>
          ) : (
            (() => {
              const grouped = splList.reduce((acc, item) => {
                if (!acc[item.CNP_NM]) acc[item.CNP_NM] = [];
                acc[item.CNP_NM].push(item);
                return acc;
              }, {});
              return Object.entries(grouped).map(([region, items]) =>
                items.map((item, idx) => (
                  <TableRow key={region + idx}>
                    {idx === 0 && (
                      <TableCell rowSpan={items.length} className="thSt">
                        {region}
                      </TableCell>
                    )}
                    <TableCell>{item.LTR_SPL_RMNO}</TableCell>
                    <TableCell>{item.DNG_HS_ADR}</TableCell>
                    <TableCell className="text-right">{item.QUP_CNT}</TableCell>
                  </TableRow>
                ))
              );
            })()
          )}
        </TableBody>
      </Table>
      {/* 첨부파일 섹션 */}
      <div className="detail-section">
        <h3 className="detail-subtitle">첨부파일</h3>
        <div className="detail-grid">
          {/* 공고문 파일 섹션 */}
          {noticeFiles.length > 0 && (
            <div className="detail-row">
              <div className="detail-label">공고문</div>
              <div className="detail-content">
                <ul className="bbsV_link file">
                  {noticeFiles.map((file, idx) => (
                    <li key={idx} className="file-bullet notice-file flex items-center gap-2">
                      <a
                        href={file.AHFL_URL}
                        className="file-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.CMN_AHFL_NM}
                      </a>
                      <a
                        href={file.AHFL_URL}
                        download
                        className="ml-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition"
                        title="다운로드"
                      >
                        다운로드
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* 기타 파일 섹션 */}
          {otherFiles.length > 0 && (
            <div className="detail-row">
              <div className="detail-label">기타 다운로드</div>
              <div className="detail-content">
                <ul className="bbsV_link file">
                  {otherFiles.map((file, idx) => (
                    <li key={idx} className="file-bullet flex items-center gap-2">
                      <a
                        href={file.AHFL_URL}
                        className="file-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.CMN_AHFL_NM}
                      </a>
                      <a
                        href={file.AHFL_URL}
                        download
                        className="ml-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition"
                        title="다운로드"
                      >
                        다운로드
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* 파일이 없을 때 안내문구 */}
          {files.length === 0 && (
            <div className="detail-row">
              <div className="detail-label">첨부파일</div>
              <div className="detail-content">첨부파일이 없습니다.</div>
            </div>
          )}
        </div>
      </div>

      {/* 서류접수기간 섹션 */}
      <div className="detail-section">
        <h3 className="detail-subtitle">접수 일정</h3>
        <div className="detail-grid-3">
          <div className="detail-row">
            <div className="detail-label">접수기간</div>
            <div className="detail-content">{main?.dsSplScdl?.[0]?.SBSC_ACP_ST_DT || '이 데이터는 제공되지 않습니다.'} ~ {main?.dsSplScdl?.[0]?.SBSC_ACP_CLSG_DT || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">서류접수기간</div>
            <div className="detail-content">{main?.dsSplScdl?.[0]?.PPR_ACP_ST_DT || '이 데이터는 제공되지 않습니다.'} ~ {main?.dsSplScdl?.[0]?.PPR_ACP_CLSG_DT || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">서류대상자 발표일 </div>
            <div className="detail-content ml-4">{main?.dsSplScdl?.[0]?.PPR_SBM_OPE_ANC_DT || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">당첨자 발표</div>
            <div className="detail-content">{main?.dsSplScdl?.[0]?.PZWR_ANC_DT || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
        </div>
      </div>

      {/* 운영기간 섹션 */}
      <div className="detail-section">
        <h3 className="detail-subtitle">운영 기간</h3>
        <div className="detail-grid">
          <div className="detail-row">
            <div className="detail-label">시작일</div>
            <div className="detail-content">{main?.dsCtrtPlc?.[0]?.TSK_ST_DTTM || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">종료일</div>
            <div className="detail-content">{main?.dsCtrtPlc?.[0]?.TSK_ED_DTTM || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
        </div>
      </div>

      {/* 접수처 정보 섹션 */}
      <div className="detail-section">
        <h3 className="detail-subtitle">접수처 정보</h3>
        <div className="detail-grid">
          <div className="detail-row">
            <div className="detail-label">주소</div>
            <div className="detail-content">{main?.dsSbdDongAhfl?.[0]?.CTRT_PLC_ADR || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">전화번호</div>
            <div className="detail-content">{main?.dsCtrtPlc?.[0]?.SIL_OFC_TLNO || '이 데이터는 제공되지 않습니다.'}</div>
          </div>
        </div>
      </div>

      {/* 기타 정보 섹션 */}
      <div className="detail-section">
        <h3 className="detail-subtitle">추가 정보</h3>
        <div className="detail-grid">
          <div className="detail-row">
            <div className="detail-label">모집지역</div>
            <div className="detail-content">{main?.dsEtcInfo?.[0]?.ARAG_RCR_HSH_CTS || '-'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">임대기간</div>
            <div className="detail-content">{main?.dsEtcInfo?.[0]?.LSTR_CTS || '-'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">임대료</div>
            <div className="detail-content">{main?.dsEtcInfo?.[0]?.LSC_CTS || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailTable;
