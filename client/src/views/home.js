import { Box,  Flex, Wrap} from '@chakra-ui/react'
import Nav from '../components/nav'
import ProductCard from '../components/productCard'
import SideBlock from '../components/sideBlock'
import ImageSlider from '../components/carousel'
import { SlideData } from '../assets/SlideData'
import FooterWithSocial from '../components/footer'
import SearchBox from '../components/search'

export default function Home() {
    return (
        <div>
            <Nav/>
            <SearchBox/>
            <Flex m='5% 8% 5% 4%'>
                {/* 左側導覽列 */}
                <Box minW='200' maxW="200">
                    <SideBlock />
                </Box>

                {/* 右側內容 */}
                <Box maxW='80%' ml='10%'>
                    <Box >
                        <ImageSlider slides={SlideData}/>
                    </Box>
                    <Wrap spacing='10' p='2%'>
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                    </Wrap>
                </Box>
            
            </Flex>
            <FooterWithSocial/>
        </div>
    )
}