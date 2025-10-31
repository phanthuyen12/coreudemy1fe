import {videoProductService} from "../services/videosProductServices.js";

export class videosProductController {
    constructor() {
        this.videos = [];
        this.loading = false;
        this.error = null;
    }
    async createVideoProduct(formData) {
        this.loading = true;
        this.error = null;

        const newVideo = await videoProductService.createVideoProduct(formData);
        this.loading = false;
        return newVideo;
    }
    async getVideoProductById(id) {
        this.loading = true;
        this.error = null;
        
        const video = await videoProductService.getVideoProductById(id);
        this.loading = false;
        return video;
    }
    async getVideoProducts(filter) {    
        this.loading = true;
        this.error = null;
        
        const data = await videoProductService.getVideoProducts(filter);
        this.videos = data?.data || [];
        this.loading = false;
        return data;
    }
    async updateVideoProduct(id, formData) {
        this.loading = true;
        this.error = null;
        
        const updatedVideo = await videoProductService.updateVideoProduct(id, formData);
        this.loading = false;
        return updatedVideo;
        
    }
}