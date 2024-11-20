const initialState = {
    // initial state
    users: [],invoices:[]
  };
  
  const yourReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_INVOICE':
        return {
          ...state,
          invoices: [...state.invoices, action.payload],
          // update state
        };
      case 'ADD_USER':
        return {
          ...state,
          users: [...state.users, action.payload],
          // update state
        };
      default:
        return state;
    }
  };
  
  export default yourReducer;

//   export const cartReducer = (state = { cartItems: [],shippingInfo:{}}, action ) =>{
//     switch(action.type){
//         case ADD_TO_CART:
//             const item = action.payload;
//             const isItemExist = state.cartItems.find(
//                 (i) => i.product === item.product
//             )

//             if(isItemExist){
//                 return{
//                     ...state,
//                     cartItems:state.cartItems.map((i)=>
//                     i.product === isItemExist.product?item:i)
//                 }
//             }else{
//                 return{
//                     ...state,
//                     cartItems:[...state.cartItems,item],
//                 }
//             }
//         case REMOVE_CART_ITEM:
//             return{
//                 ...state,
//                 cartItems:state.cartItems.filter((i)=> i.product !== action.payload)
//             }
//         case SAVE_SHIPPING_INFO:
//             return{
//                 ...state,
//                 shippingInfo:action.payload
//             }
        
//         default :
//         return state;
//     }
// }