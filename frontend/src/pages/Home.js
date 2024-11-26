import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"biryani"} heading={"Top's biryani"}/>
      <HorizontalCardProduct category={"pizza"} heading={"Popular's Pizza"}/>

      <VerticalCardProduct category={"icecreams"} heading={"Cool Ice creams"}/>
      <VerticalCardProduct category={"kfc"} heading={"KFC"}/>
      <VerticalCardProduct category={"veg"} heading={"Veg Food items"}/>
      {/* <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/> */}
    </div>
  )
}

export default Home