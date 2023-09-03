import { Box, Stack, Input, InputGroup, InputLeftElement  } from "@chakra-ui/react"
import {Search2Icon} from "@chakra-ui/icons"

export default function SearchBox() {
    return (
        <Box align='center'>
            <Stack align='center' direction="row" m = '2% 10%' maxW='700px'>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon w='5' h='5' color={['blackAlpha.700']} />}
                    />
                    <Input placeholder="搜尋商品..." />
                </InputGroup>
            </Stack>
        </Box>
    )
}