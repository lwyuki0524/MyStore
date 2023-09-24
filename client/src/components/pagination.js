import React, { useEffect, useState } from "react";
import { Select, Stack } from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
} from "@ajna/pagination";

export default function Pages({ fetchdata }){

    const [itemsTotal, setItemsTotal] = useState();
    
    const {
      pages, pagesCount,
      currentPage, setCurrentPage,
      pageSize, setPageSize,
    } = usePagination({
      total: itemsTotal,
      limits: { // 限制分頁按鈕數量
        outer: 2, //outerLimit,
        inner: 2, //innerLimit,
      },
      initialState: {
        pageSize: 5,
        currentPage: 1
      },
    });

    
    useEffect(()=>{
        // 若currentPage, pageSize有改變，就去抓資料
        fetchdata(currentPage, pageSize)
        .then((data)=>{
          setItemsTotal(data['totalItems']);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ currentPage, pageSize, itemsTotal]);

    // 切換頁面按鈕 => 設定nextPage
    const handlePageChange = (nextPage) => {
      setCurrentPage(nextPage);
    };

    // 切換頁面大小 => 設定pageSize
    const handlePageSizeChange = ( event ) => {
        const changedPageSize = Number(event.target.value)
        setPageSize(changedPageSize);
        if (currentPage*changedPageSize-changedPageSize >= itemsTotal){
            // 計算總頁數
            setCurrentPage( Math.ceil(itemsTotal/changedPageSize) );
        }
      };

  
    return (
        <Stack
            align={"center"}
            margin="20px"
        >
            <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            >
            <PaginationContainer
            align="center"
            justify="space-evenly"
            p={4}
            w="full">
                <PaginationPrevious
                borderRadius={'5px'}
                w={"fit-content"}
                _hover={{
                    bg: "yellow.400"
                  }}
                  bg="yellow.300"
                  >
                    上一頁
                </PaginationPrevious>
                <PaginationPageGroup>
                {pages.map((page) => (
                    <PaginationPage
                    margin="0 2px"
                    borderRadius={'5px'}
                    w={7}
                    bg="red.300"
                    key={`pagination_page_${page}`} 
                    page={page} 
                    fontSize="sm"
                    _hover={{
                      bg: "green.300"
                    }}
                    _current={{
                      bg: "green.300",
                      fontSize: "sm",
                      w: 7
                    }}
                    />
                ))}
                </PaginationPageGroup>
                <PaginationNext
                w={"fit-content"}
                borderRadius={'5px'}
                _hover={{
                    bg: "yellow.400"
                  }}
                  bg="yellow.300"
                  >
                    下一頁
                </PaginationNext>
            </PaginationContainer>
            </Pagination>
            <Select ml={3} onChange={handlePageSizeChange} defaultValue={5} w={40}>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </Select>
        </Stack>
    );
  };
