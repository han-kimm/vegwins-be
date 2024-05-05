import mongoose from "mongoose";

export interface ICarousel {
  title: string;
  imageUrl: string;
  href: string;
}

const carouselSchema = new mongoose.Schema<ICarousel>(
  {
    title: String,
    imageUrl: String,
    href: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Carousel = mongoose.model("Carousel", carouselSchema);

export default Carousel;
