export interface UpdateItemWish {
  /**
   * @minimum 1
   * @maximum 5
   */
  build_enabling?: number;
  fulfilled?: boolean;
  /** @minimum 0 */
  priority?: number;
  /**
   * @minimum 1
   * @maximum 5
   */
  quantity?: number;
}
