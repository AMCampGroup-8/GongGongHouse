import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function AnnouncementTable(props) {
  const { announcements } = props;
  return (
    <div className="rounded-md border">
      <Table className="text-gray-800">
        <TableHeader>
          <TableRow className="bg-[#5DC1B7]">
            <TableHead>번호</TableHead>
            <TableHead>지역</TableHead>
            <TableHead>공고명</TableHead>
            <TableHead>청약유형</TableHead>
            <TableHead>게시일</TableHead>
            <TableHead>마감일</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.ANNOUNCEMENT_NO}</TableCell>
              <TableCell>{item.CNP_CD_NM}</TableCell>
              <TableCell>
              <Link
                to={`/announcement/${item.PAN_ID}`}
                state={{
                  PAN_ID: item.PAN_ID,
                  PAN_NM: item.PAN_NM,
                  AIS_TP_CD_NM: item.AIS_TP_CD_NM,
                  CNP_CD_NM: item.CNP_CD_NM,
                  PAN_NT_ST_DT: item.PAN_NT_ST_DT,
                  CLSG_DT: item.CLSG_DT,
                  PAN_SS: item.PAN_SS,
                  SPL_INF_TP_CD: item.SPL_INF_TP_CD,
                  CCR_CNNT_SYS_DS_CD: item.CCR_CNNT_SYS_DS_CD,
                  UPP_AIS_TP_CD: item.UPP_AIS_TP_CD,
                  DTL_URL: item.DTL_URL
                }}
              >
                {item.PAN_NM}
              </Link>
              </TableCell>
              <TableCell>{item.AIS_TP_CD_NM}</TableCell>
              <TableCell>{item.PAN_NT_ST_DT}</TableCell>
              <TableCell>{item.CLSG_DT}</TableCell>
              <TableCell>{item.PAN_SS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AnnouncementTable;