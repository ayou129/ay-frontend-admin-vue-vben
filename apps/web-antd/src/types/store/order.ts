// 商品相关的类型
export interface Order {
  id: number;
  sn: string;
  user_id: number;
  type: OrderType; // 1=虚拟商品 2=实物商品 3=酒店订单
  status: OrderStatus; // 0=待支付 100=已支付,待核销 110=已完成 -100=已取消 -11=部分已退款 -12=已退款 -21=部分已过期 -22=已过期
  amount: string;
  delivery_type: OrderDeliveryType; // 1=线上核销 2=现场领取 3=线下入住
  extra_info?: string;
  created_at: string;
  updated_at: string;
}

export enum OrderItemStatus {
  Cancelled = -100, // 已取消
  Completed = 110, // 已完成[已核销/已领取]
  Expired = -22, // 已过期
  Paid = 100, // 已支付，待核销
  Pending = 0, // 待支付
  Refunded = -12, // 已退款
}

export interface OrderDefaultItem {
  id: number;
  order_id: number;
  sku_id: number;
  quantity: number;
  item_amount: string;
  valid_date: string;
  status: OrderItemStatus; // -1=待支付 100=已支付,待核销 110=已完成 -100=已取消 -12=已退款 -22=已过期
  created_at: string;
  updated_at: string;
}

// 酒店订单项状态枚举 (与订单状态相似但有细微差别)
export enum HotelOrderItemStatus {
  Cancelled = -100, // 已取消
  CheckedIn = 110, // 已入住
  Expired = -22, // 已过期
  Paid = 100, // 已支付，待核销
  Pending = -1, // 待支付
  Refunded = -12, // 已退款
}

export interface OrderHotelItem {
  id: number;
  order_id: number;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  room_number?: string;
  is_occupation: boolean;
  status: HotelOrderItemStatus; // -1=待支付 100=已支付,待核销 110=已入住 -100=已取消 -12=已退款 -22=已过期
  created_at: string;
  updated_at: string;
}

// 退款状态枚举
export enum RefundStatus {
  Completed = 1, // 已退款
  Pending = 0, // 待退款
}

export interface OrderRefund {
  id: number;
  order_id: number;
  amount: number;
  status: RefundStatus; // -1=待退款 1=已退款
  created_at: string;
  updated_at: string;
}

// 退款记录类型枚举
export enum RefundRecordType {
  Manual = 1, // 私下退款
  Original = 0, // 原路返回
}

export interface OrderRefundRecord {
  id: number;
  order_id: number;
  order_refund_id: number;
  amount: number;
  type: RefundRecordType; // -1=原路返回 1=私下退款
  created_at: string;
  updated_at: string;
}

export enum OrderType {
  Hotel = 3, // 酒店订单
  Physical = 2, // 实物商品
  Virtual = 1, // 虚拟商品
}

export enum OrderStatus {
  Cancelled = -100, // 已取消
  Completed = 110, // 已完成[已核销/已领取/已入住]
  Expired = -22, // 已过期
  Paid = 100, // 已支付，待核销
  PartialExpired = -21, // 部分已过期
  PartialRefunded = -11, // 部分已退款
  Pending = 0, // 待支付
  Refunded = -12, // 已退款
}

export enum OrderDeliveryType {
  OfflineCheckin = 3, // 线下入住
  OfflinePickup = 2, // 现场领取
  OnlineVerify = 1, // 线上核销
}
