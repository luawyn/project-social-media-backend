"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const BaseError_1 = require("../errors/BaseError");
class PostController {
    constructor(postBusiness) {
        this.postBusiness = postBusiness;
        this.getPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    token: req.headers.authorization,
                };
                const output = yield this.postBusiness.getPosts(input);
                res.status(200).send(output);
            }
            catch (error) {
                if (error instanceof BaseError_1.BaseError) {
                    res.status(error.statusCode).send(error.message);
                }
                else {
                    res.status(500).send("Erro inesperado");
                }
            }
        });
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    token: req.headers.authorization,
                    context: req.body.context,
                };
                yield this.postBusiness.createPost(input);
                res.status(201).end();
            }
            catch (error) {
                if (error instanceof BaseError_1.BaseError) {
                    res.status(error.statusCode).send(error.message);
                }
                else {
                    res.status(500).send("Erro inesperado");
                }
            }
        });
        this.editPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    idToEdit: req.params.id,
                    context: req.body.context,
                    token: req.headers.authorization,
                };
                yield this.postBusiness.editPost(input);
                res.status(200).end();
            }
            catch (error) {
                if (error instanceof BaseError_1.BaseError) {
                    res.status(error.statusCode).send(error.message);
                }
                else {
                    res.status(500).send("Erro inesperado");
                }
            }
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    idToDelete: req.params.id,
                    token: req.headers.authorization,
                };
                yield this.postBusiness.deletePost(input);
                res.status(200).end();
            }
            catch (error) {
                if (error instanceof BaseError_1.BaseError) {
                    res.status(error.statusCode).send(error.message);
                }
                else {
                    res.status(500).send("Erro inesperado");
                }
            }
        });
        this.likeOrDislikePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    idToLikeOrDislike: req.params.id,
                    token: req.headers.authorization,
                    like: req.body.like,
                };
                yield this.postBusiness.likeOrDislikePost(input);
                res.status(200).end();
            }
            catch (error) {
                if (error instanceof BaseError_1.BaseError) {
                    res.status(error.statusCode).send(error.message);
                }
                else {
                    res.status(500).send("Erro inesperado");
                }
            }
        });
    }
}
exports.PostController = PostController;
//# sourceMappingURL=PostController.js.map