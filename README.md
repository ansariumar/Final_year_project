
# Eco Cycle

An ecommerce website for recycled Products. 
(This site was made for a uni Project and isn't advised to be used for real world purpose)

## Tech Stack

**Client:** EJS, Bootstrap

**Server:** Node, Express

**Database:** MongoDB with Mongoose 



## Run Locally

You should have mongoDB and node installed in your PC before running this project

Clone the project

```bash
  git clone https://github.com/ansariumar/Final_year_project.git
```

Go to the project directory

```bash
  cd Final_year_project
```

Install dependencies

```bash
  npm install
```
Set the connection String
  
    You will find the file "index.js" in the root directory.
    Open it and change the connection string to your connnection string

Start the server

```bash
  npm run devStart
```
Open the browser and connect to the localhost

```bash
  http://localhost:3000/
```


## TO DO after installation

##### 1. Register and Login first, and after successfuly login , go to mongoDB compass and edit the value of admin: 1

##### 2. Now Logout and login again as Admin

##### 3. Now you can access the admin panel(top right of the navbar, the middle icon)

##### 4. The first thing to do in the admin panel is  to go to the "Pages" section and create a page named "home", be aware that you can't the home page

## Features

- Very Light weight(no frontend framework used)
- Add, update, delete and view Products
- login system(very simple)
- Different view for non-logged in users
- Cart system(fully functional)
- Payment system with Paypal integration
- Powerful Validation with less bugs
- Responsive
- Admin Functionality
    - CRUD on pages(about page etc..)
    - flora editior in Add page 
    - CRUD operation on Categories
    - CRUD operation on Products(Product can have categories, PRODUCT- CATEGEORY relation)
    - Simple drag and drop for adding Product images, product subimages  as well Steps for creating the products
    - Can provide youtube link for a Product

    
## Bugs

sometime the login button appear even if the user is  logged in

If you have added images of steps, and want to delete on of the images, you can't, you have to delete then whole product and then add the images again.

Some images of the steps do not render.

When you are deleting the product subimages, there will be an image in the last whose photo won't render and thats the Product's main image, delete it and the system crashes 


## 🚀 About Me
I'm dead inside and have no intentions whatsoever to fix this project

I submitted this Project 2 days before the submission date, and the teacher said "Add this functionality", that day was also friend's bday so I was eating at the restaurent with them with the tension of comleting a feature in mere 12 hours(my friends were not my teammates)

long story short, started working on that feature at 12 AM and finished it by 4 AM and took a very satisfied sleep

## Support

Oh yeah, though i won't fix bugs, but

contact me at umar.ansari7331@gmail.com if you need anything related to this project

