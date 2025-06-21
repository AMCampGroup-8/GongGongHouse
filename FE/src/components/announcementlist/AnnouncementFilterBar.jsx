import React, { useState } from 'react';
// import { getLhAnnouncements } from './api';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"

function AnnouncementFilterBar(props) {
  
  const { onFilter } = props;
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    status: '',
    dateType: '',
    startDate: '',
    endDate: '',
    title: ''
  });

  const handleFilter = () => {
    // "전체" 선택 시 빈 문자열로 변환
    const filteredValues = {
      type: filters.type === "전체" ? "" : filters.type,
      region: filters.region === "전체" ? "" : filters.region,
      status: filters.status === "전체" ? "" : filters.status,
      dateType: filters.dateType === "전체" ? "" : filters.dateType,
      startDate: filters.dateType ? filters.startDate : '',
      endDate: filters.dateType ? filters.endDate : '',
      title: filters.title
    };
    onFilter(filteredValues);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="공고유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="매입임대">매입임대</SelectItem>
              <SelectItem value="전세임대">전세임대</SelectItem>
              <SelectItem value="행복주택">행복주택</SelectItem>
              <SelectItem value="행복주택(신혼희망)">행복주택(신혼희망)</SelectItem>
              <SelectItem value="통합공공임대(신혼희망)">통합공공임대(신혼희망)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="공고지역" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="서울특별시">서울특별시</SelectItem>
              <SelectItem value="부산광역시">부산광역시</SelectItem>
              <SelectItem value="대구광역시">대구광역시</SelectItem>
              <SelectItem value="인천광역시">인천광역시</SelectItem>
              <SelectItem value="광주광역시">광주광역시</SelectItem>
              <SelectItem value="대전광역시">대전광역시</SelectItem>
              <SelectItem value="울산광역시">울산광역시</SelectItem>
              <SelectItem value="세종특별자치시">세종특별자치시</SelectItem>
              <SelectItem value="경기도">경기도</SelectItem>
              <SelectItem value="강원도">강원도</SelectItem>
              <SelectItem value="충청북도">충청북도</SelectItem>
              <SelectItem value="충청남도">충청남도</SelectItem>
              <SelectItem value="전북특별자치도">전북특별자치도</SelectItem>
              <SelectItem value="전라남도">전라남도</SelectItem>
              <SelectItem value="전라북도">전라북도</SelectItem>
              <SelectItem value="경상북도">경상북도</SelectItem>
              <SelectItem value="경상남도">경상남도</SelectItem>
              <SelectItem value="제주특별자치도">제주특별자치도</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="공고상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="공고중">공고중</SelectItem>
              <SelectItem value="접수중">접수중</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters(prev => ({ ...prev, dateType: value }))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="게시/마감 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="전체">전체 기간</SelectItem>
              <SelectItem value="게시일">게시일</SelectItem>
              <SelectItem value="마감일">마감일</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {filters.dateType && filters.dateType !== "전체" && (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger disabled={!filters.dateType}>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[170px] justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground",
                    !filters.dateType && "cursor-not-allowed bg-gray-100"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(new Date(filters.startDate), "yyyy년 MM월 dd일") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate ? new Date(filters.startDate) : undefined}
                  onSelect={(date) => {
                    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
                    setFilters(prev => ({ ...prev, startDate: koreaDate.toISOString().split('T')[0] }));
                  }}
                  disabled={!filters.dateType}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span>~</span>
            <Popover>
              <PopoverTrigger disabled={!filters.dateType}>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[170px] justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground",
                    !filters.dateType && "cursor-not-allowed bg-gray-100"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(new Date(filters.endDate), "yyyy년 MM월 dd일") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate ? new Date(filters.endDate) : undefined}
                  onSelect={(date) => {
                    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
                    setFilters(prev => ({ ...prev, endDate: koreaDate.toISOString().split('T')[0] }));
                  }}
                  disabled={!filters.dateType}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input 
          type="text"
          placeholder="공고명"
          className="border px-2 py-1 w-[200px] flex-grow"
          value={filters.title}
          onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
        />
        <Button
          className="bg-[#EFFFF8] text-black px-4 py-1 rounded hover:bg-[#5DC1B7] cursor-pointer"
          onClick={handleFilter}
        >
          조회
        </Button>
      </div>
    </div>  
  );
}

export default AnnouncementFilterBar;