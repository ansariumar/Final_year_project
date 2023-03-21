// or:
const { mkdirp } = require('mkdirp')

// return value is a Promise resolving to the first directory created
mkdirp('public/product_images/', (err) => {
    return console.log(err)
})


{/* <ul class="navbar-nav navbar-right">
<li>
  <a href="/cart/checkout">My Cart(
    <%if (typeof cart !== "undefined"){%>
      <%=cart.length%>
      <%}else{%>
        0
      <%}%>
  )</a>
</li>
<%if(user){%>
  <li>
    <a href="/user/logout">Hi,<%=user.username%> (Logout)</a>
  </li>
  
  <%}else{%>
    <li>
      <a href="/user/register">Register</a>
    </li>
    <li>                <a href="/user/login">Login</a>
    </li>

    <%}%>
    <%if(user && user.admin == 1){%>
      <li>
        <a href="/admin/pages">Admin Area</a>
      </li>
      
      <%}%>


</ul> */}