export type ProductItem = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  photos: {
    _id: string
    url: string
  }[]
  name: string
  description: string
  category: {
    _id: string
    thumbnail: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
  }
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  price: number
  priceAfterDiscount: number
  createdAt: string
  updatedAt: string
}
