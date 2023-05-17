import { Fragment } from "react";
import { Form } from "react-bootstrap";

const AttributesFilterComponent = () => {
  const data = [{color:["red","blue","green"]},{ram:["1TB","2TB","3TB"]}]

  return (
    data.map((item,index)=>{
      return(
      <Fragment key={index}>
      <Form.Label><b>{Object.keys(item)}</b></Form.Label>
      {item[Object.keys(item)].map((i,index)=>{
        return(
          <Form.Check 
        type="checkbox"
        label={i}
        key={index}
      />
        )
      })}

    </Fragment> 
      )
    })
     
  );
};

export default AttributesFilterComponent;
