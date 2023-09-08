import { Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlider = ({ slides }) => {
    return (
      <Carousel infiniteLoop showThumbs={false}>
        {slides.map((slide, index) => {
          return <Image key={index} src={slide.image} height="300px" width="600px" />;
        })}
      </Carousel>
    );
  };

export default ImageSlider;