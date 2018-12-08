const express = require('express')
    , router = express.Router()
    , app = express()
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , User = require('../models/user')
    , path = require('path')
    , { ensureUserIsAdmin } = require('../helpers/auth')
    , multer = require('multer')
    , cloudinary = require('cloudinary')
    , cloudinaryStorage = require('multer-storage-cloudinary')
    , multerUploads = multer({ dest: 'uploads/'})
    , sendGrid = require('@sendgrid/mail');

app.use(require('body-parser').urlencoded({ extended: false }));

//importing models
let Product = require('../models/product');
//setting storage
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads',
    transformation: [{crop: 'limit'}],
    allowedFormats: ['jpg','png','jpeg'],
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});
const upload = multer({
    storage: storage
}).array('pImages',3);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});
passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, username, password, done) => {
    User.getUserByEmail(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        };
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid Password' });
            }
        });

    });
}));

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

let msg = {
    to: 'israelakintunde005@gmail.com',
    from: 'admin@fabrixrus.com',
    subject: 'TESTING',
    html: '<strong> This is strong, eleyi gidigan </strong>'
};

sendGrid.send(msg);

router.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

router.get('/login', (req, res) => {
    if (req.user) {
        res.redirect(303,'/admin');
    } else {
        res.render('admin/login', {
            title: 'Admin Login',
            isAdminPage: 'isAdminPage',
            error: req.flash('error')
        });
    }
});

router.get('/', ensureUserIsAdmin, (req,res) => {
    Product.find((err, products) => {
        let partProducts = [];
        let desiredNumber = 8;
        let userName;
        if (req.user && req.user.isAdmin === 'admin') {
            userName = 'Admin'
        } else if (req.user && req.user.isAdmin !== 'admin') {
            userName = req.user.name;
        }
        if (products.length >= desiredNumber) {
            for (let i = 0; i < desiredNumber; i++) {
                partProducts.push(products[i]);
            }
        } else {
            partProducts = products;
        }
        res.render('admin/dashboard', {
            isAdminPage: 'isAdminPage',
            dashboard: 'dashboard',
            postSuccess: req.flash('posted'),
            userName: userName,
            title: 'Admin Dashboard',
            partProducts: partProducts
        });
    }, err => { console.warn(`The following error occurred: ${err}`); })
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/admin/login', failureFlash: "Invalid Username and/or password"
}), (req, res) => {
    if (req.user.isAdmin === 'admin') {
        req.flash('Success', 'You are successfully logged in');
        let newLink;
        //trying to check for the intended URL
        if (req.body.docRef === req.body.docRef2) {
            newLink = '/admin';
        } else {
            newLink = req.body.docRef2;
        }
        res.redirect(
            303,
            newLink
        );
    } else {
        req.flash('error','You are not an admin')
    }
});
router.get('/account_settings', ensureUserIsAdmin, (req,res) => {
    User.findOne({
        isAdmin: 'admin'
    },(err,user) => {
        if (err) throw err;
        res.render('admin/edit_profile', {
            isAdminPage: 'isAdminPage',
            dashboard: 'dashboard',
            title: 'Admin | Account Settings',
            admin: user
        });
    })
});

router.post('/account_settings', (req,res) => {
    let userID = req.body.id;
    let email = req.body.email;
    let phone = req.body.phone;
    let name = req.body.name;
    let password = req.body.password;

    // /checking for validation
    req.checkBody('email', 'Ma\'am this must be a valid email').notEmpty();
    req.checkBody('phone', 'You should enter a correct phone number ma\'am').notEmpty();
    req.checkBody('phone', 'And the product also must have a price').isNumeric();
    req.checkBody('name', 'And the product also must have a price').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_profile', {
            isAdminPage: 'isAdminPage',
            dashboard: 'dashboard',
            title: 'Admin | Account Settings',
            errors: errors
        })
    } else {
        User.findOne({
            _id: userID
        }, (err,user) => {
            if (err) throw err;
            if (user && (user.email !== email || user.name !== name || user.phone !== phone)) {
                User.comparePassword(password, user.password, (err,isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        let updateUserDetails = {
                            email: email,
                            phone: phone,
                            name: name
                        };
                        User.updateUserDetails(user, updateUserDetails, (err,newUser) => {
                            if (err) throw err;
                        });
                        req.flash('Success','Profile updated successfully');
                        res.location('/admin');
                        res.redirect(303,'/admin');
                    }
                });
            } else {
                res.render('admin/account_settings', {
                    isAdminPage: 'isAdminPage',
                    dashboard: 'dashboard',
                    title: 'Admin | Account Settings',
                    detailError: req.flash('warning','Yo, you didn\'t change anything, oh please')
                });
            }
        })
    }
});
router.get('/admin-logout', (req, res) => {
    req.logout();
    req.flash('LoggedOut', 'You are logged out');
    res.redirect(303, '/admin/login');
});

router.get('/dashboard',ensureUserIsAdmin, (req,res) => {
    Product.find((err, products) => {
        if (err) throw err;
        let partProducts = [];
        let desiredNumber = 8;
        let userName;
        if (req.user && req.user.isAdmin === 'admin') {
            userName = 'Admin'
        } else if (req.user && req.user.isAdmin !== 'admin') {
            userName = req.user.name;
        }
        if (products.length >= desiredNumber) {
            for (let i = 0; i < desiredNumber; i++) {
                partProducts.push(products[i]);
            }
        } else {
            partProducts = products;
        }
        res.render('admin/dashboard', {
            isAdminPage: 'isAdminPage',
            dashboard: 'dashboard',
            postSuccess: req.flash('posted'),
            userName: userName,
            title: 'Admin Dashboard',
            partProducts: partProducts
        });
    }, err => { console.warn(`The following error occurred: ${err}`); })
});

router.get('/edit-account',ensureUserIsAdmin, (req,res) => {
    res.render('admin/edit_profile',{
        title: 'Edit Profile'
    });
});

router.get('/post', ensureUserIsAdmin, (req,res) => {
    res.render('admin/post_product', {
        isAdminPage: 'isAdminPage',
        postProduct: 'postProduct',
        title: 'Add Product'
    });
});

router.post('/postProduct',ensureUserIsAdmin ,upload, (req,res) => {
    let title = req.body.title;
    let price = req.body.price;
    let color = req.body.color;
    let description = req.body.description;
    let image = req.files;
    //checking for validation
    req.checkBody('title', 'Ma\'am the product must have a title, might I suggest *Aso-Ebi*').notEmpty();
    req.checkBody('price', 'And the product also must have a price').notEmpty();
    req.checkBody('price', 'And the product price must also be a number').isNumeric();
    req.checkBody('description', 'The description field should not be left empty').notEmpty();
    req.checkBody('color', 'People would love to know what color the clothe is').notEmpty();

    //validation errors
    let postErrors = req.validationErrors();
    if (postErrors) {
        res.render('admin/post_product', {
            errors: postErrors,
            title: 'Post Product',
            ptitle: title,
            price: price,
            description: description,
            color: color
        });
    }
    let newProduct = new Product({
        title: title,
        description: description,
        price: price,
        color: color,
        imagePath1: image[0].url,
        imagePath2: image[1].url,
        imagePath3: image[2].url
    });
    Product.postProduct(newProduct, (err, product) => {
        if (err) {
            console.log(`Images didnt upload for the following reasons ${err}`)
        };
        req.flash('posted', 'Posted successfully');
        res.location('/admin');
        res.redirect(302, '/admin');
    });
});
router.post('/post-edit/:id',ensureUserIsAdmin ,upload, (req,res) => {
    let title = req.body.title;
    let price = req.body.price;
    let color = req.body.color;
    let description = req.body.description;
    let image = req.files;
    console.log(req.files);
    //checking for validation
    req.checkBody('title', 'Ma\'am the product must have a title, might I suggest *Aso-Ebi*').notEmpty();
    req.checkBody('price', 'And the product also must have a price').notEmpty();
    req.checkBody('price', 'And the product price must also be a number').isNumeric();
    req.checkBody('description', 'The description field should not be left empty').notEmpty();
    req.checkBody('color', 'People would love to know what color the clothe is').notEmpty();

    //validation errors
    let postErrors = req.validationErrors();
    if (postErrors) {
        res.render('admin/edit_product', {
            errors: postErrors,
            title: 'Edit Product',
            ptitle: title,
            price: price,
            isAdminPage: 'isAdminPage',
            description: description,
            color: color
        });
    }
    let updatedProduct = {
        title: title,
        description: description,
        price: price,
        color: color,
        imagePath1: image[0].url,
        imagePath2: image[1].url,
        imagePath3: image[2].url
    };
    Product.updateProduct(req.params.id, updatedProduct,(err, product) => {
        if (err) {
            console.log(`Images didnt upload for the following reasons ${err}`)
        };
        req.flash('posted', 'Post Updated successfully');
        res.location('/admin');
        res.redirect(303, '/admin');
    });
});

router.delete('/delete/:id', ensureUserIsAdmin, (req,res) => {
    Product.deleteProduct(req.params.id, (err) => {
        if (err) throw err;
        req.flash('posted','Post deleted successfully');
        res.location('/admin');
        res.redirect(303, '/admin')
    });
});

router.get('/post-edit/:id', ensureUserIsAdmin, (req,res) => {
    Product.findOne({
        _id: req.params.id
    }, (err, product) => {
        if (err) throw err;
        let { _id:id,title,color,description,price,imagePath1,imagePath2,imagePath3 } = product;
        let productDetails = {
            id: id,
            title: title,
            color: color,
            description: description,
            price: price,
            imagePath1: imagePath1,
            imagePath2: imagePath2,
            imagePath3: imagePath3
        };
        res.render('admin/edit_product', {
            isAdminPage: 'isAdminPage',
            title: 'Admin Dashboard',
            product: productDetails
        }); 
    });
});

router.get('/register', (req, res) => {
    res.render('admin/register', {
        title: 'Admin Register'
    });
});

router.post('/register', (req,res) => {
    let email = req.body.email;
    let name =  req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;
    let password2 = req.body.password;

    //form validation
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('phone', 'Phone field is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('name', 'name field is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords don\'t match').equals(password);

    //checking for errors
    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/register', {
            errors: errors,
            title: 'Admin Register',
            email: email,
            name: name,
            password: password,
            password2: password2
        });
    } else {
        User.getUserByEmail(email, (err, itExists) => {
            if (err) throw err;
            if (itExists) {
                let emailExistsError = "Email already exists";
                res.render('admin/register', {
                    emailExists: emailExistsError,
                    title: 'Admin Register',
                    email: email,
                    phone: phone,
                    password: password,
                    password2: password2
                });
            } else {
                let newUser = new User({
                    email: email,
                    phone: phone,
                    name: name,
                    isAdmin: 'admin',
                    password: password
                });

                //create user
                User.createUser(newUser, (err, user) => {
                    if (err) throw err;
                });
                req.flash('success', 'You are registered');
                res.location('/');
                res.redirect(302, '/admin/login');
            }
        });
    }
});


module.exports = router;