const {category, productCategory} = require('../../models')

exports.addCategory = async (req, res) => {
  try {
    const newCategory = await category.create(req.body);

    res.send({
      status: "success",
      data: {
        id: newCategory.id,
        name: newCategory.name
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "create data not found",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server category Error",
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const {id} = req.params
    const data = await category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server users Error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const newCategory = await category.update(req.body, {
      where: {
        id,
      }
    });
    res.send({
      status: "success",
      data: {
        id: newCategory.id,
        name: newCategory.name
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "failed update",
      message: "file not found",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await category.destroy({
      where: {
        id,
      },
    });

    await productCategory.destroy({
      where: {
        idCategory: id,
      },
    });

    res.send({
      status: "success",
      message: `Delete Category id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};