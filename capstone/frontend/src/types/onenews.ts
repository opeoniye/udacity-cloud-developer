export default class Iroyins {
    onenewsId: string;
    onenewsTitle: string;
    onenewsSummary: string;
    onenewsBody: string;
    oneattachmentUrl: string;

    constructor(newsId: string, newsTitle: string, newsSummary: string, newsBody: string, attachmentUrl: string) {
        this.onenewsId = newsId;
        this.onenewsTitle = newsTitle;
        this.onenewsSummary = newsSummary;
        this.onenewsBody = newsBody;
        this.oneattachmentUrl = attachmentUrl;
    } 
}