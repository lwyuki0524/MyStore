import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
  } from '@chakra-ui/react'

import { Box, Button } from '@chakra-ui/react'

export default function SideBlock() {
    const defaultIndexes = Array.from({ length: 10 }, (_, i) => i);

    return (
        <div>
            <Accordion allowMultiple defaultIndex={defaultIndexes} >
                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        分類一
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel p='0'>
                        <Button variant="ghost">
                            包包
                        </Button>
                    </AccordionPanel>
                    <AccordionPanel p='0' >
                        <Box width='100%'>
                        <Button variant="ghost">
                            娃娃
                        </Button>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem >
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        分類二
                        </Box>
                        
                        <AccordionIcon/>
                    </AccordionButton>
                    </h2>
                    <AccordionPanel p='0' >
                        <Button variant="ghost">
                            3C產品
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    )
}