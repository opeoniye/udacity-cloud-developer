/**
 * Fields in a request to update a single NEWS item.
 */
export interface EditNewsRequest {
  newsTitle: string
  newsSummary: string
  newsBody: string
}