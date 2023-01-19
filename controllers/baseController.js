const user = require("../model/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");

class BaseController {
  constructor(options) {
    this.limit = 20;
    this.options = options;
  }

  static async deleteByPhone(req, res) {
    const reqParam = req.query.phone;
    try {
      fs.readFile("seeds/users.json", (err, data) => {
        if (err) throw err;
        let objParse = JSON.parse(data);
        let query = objParse.find((x) => x.phone === reqParam);
        if (query) {
          const newArr = objParse.filter((item) => {
            return item.phone !== reqParam;
          });
          fs.writeFileSync("seeds/users.json", JSON.stringify(newArr));
          return res.send("Delete Successfully");
        } else {
          return res.status(400).send("Error Delete");
        }
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async createUser(req, res) {
    try {
      // Get user input
      const { first_name, phone } = req.body;

      // Validate user input
      if (!(first_name && phone)) {
        res.status(400).send("All input is required");
      }

      fs.readFile("seeds/users.json", (err, data) => {
        if (err) throw err;
        let objParse = JSON.parse(data);

        if (objParse.find((x) => x.phone === phone)) {
          return res.status(409).send("User Already Exist");
        } else {
          // Create token
          const token = jwt.sign({ first_name, phone }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
          });

          fs.writeFileSync(
            "seeds/users.json",
            JSON.stringify([
              ...objParse,
              { first_name: first_name, phone: phone, token: token },
            ])
          );

          // return new user
          return res
            .status(201)
            .json({ first_name: first_name, phone: phone, token: token });
        }
      });
    } catch (err) {
      return res.json(err);
    }
  }

  static async getList(req, res) {
    try {
      fs.readFile("seeds/users.json", (err, data) => {
        if (err) throw err;
        return res.status(200).json(JSON.parse(data));
      });
    } catch (err) {
      return res.json(err);
    }
  }

  static async createJWT(req, res) {
    try {
      // Get user input
      const { first_name, phone } = req.body;

      // Validate user input
      if (!(first_name && phone)) {
        res.status(400).send("All input is required");
      }

      fs.readFile("seeds/users.json", (err, data) => {
        if (err) throw err;
        let objParse = JSON.parse(data);
        let query = objParse.find((x) => x.phone === phone);
        if (query) {
          // Create token
          const token = jwt.sign({ first_name, phone }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
          });
          const newArr = objParse.filter((item) => {
            return item.phone !== phone;
          });
          query.token = token;
          fs.writeFileSync(
            "seeds/users.json",
            JSON.stringify([...newArr, query])
          );
        } else {
          return res.status(400).send("Invalid Credentials");
        }
      });
    } catch (err) {
      return res.json(err);
    }
  }

  static async verifyToken(req, res) {
    //verify JWT
    try {
      const reqBody = req.body.token;
      const decode = jwt.verify(reqBody, "ADMD");
      return res.json(decode);
    } catch (err) {
      return res.json("invalid signature");
    }
  }
}
module.exports = BaseController;
