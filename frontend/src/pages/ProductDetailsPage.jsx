import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  console.log(id);
  /*
  //normal syntax
  const params = useParams();
  const id = params.id;
  */

  return <p>This is a Login aaa</p>;
};

export default ProductDetailsPage;
