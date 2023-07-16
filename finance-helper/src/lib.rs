#![allow(non_snake_case)]

mod utils;

use rust_decimal::{Decimal, MathematicalOps};
use rust_decimal_macros::dec;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, finance-helper!");
}

#[wasm_bindgen]
pub fn calculate_pmt(
    house_price: String,
    deposit: String,
    rate: String,
    term_length: String,
) -> String {
    let house_price = Decimal::from_str(&house_price).unwrap();
    let deposit = Decimal::from_str(&deposit).unwrap();
    let rate = Decimal::from_str(&rate).unwrap();
    let term_length = Decimal::from_str(&term_length).unwrap();

    let PV = house_price - deposit;

    let APR = rate / dec!(100);

    let R = APR / dec!(12);

    let N = dec!(12) * term_length;

    let PMT = (PV * R) / (dec!(1) - (dec!(1) + R).powd(-N));

    PMT.to_string()
}

#[wasm_bindgen]
pub fn calculate_value_at_year(
    house_price: String,
    deposit: String,
    PMT: String,
    rate: String,
    years: String,
    overpayment: String,
) -> String {
    let house_price = Decimal::from_str(&house_price).unwrap();
    let deposit = Decimal::from_str(&deposit).unwrap();
    let PMT = Decimal::from_str(&PMT).unwrap();
    let rate = Decimal::from_str(&rate).unwrap();
    let years = Decimal::from_str(&years).unwrap();
    let overpayment = Decimal::from_str(&overpayment).unwrap();

    let P = house_price - deposit;
    let APR = rate / dec!(100);
    let r = APR / dec!(12);
    let k = years * dec!(12);
    let R = PMT + overpayment;

    let s = (dec!(1) + r).powd(k);

    let D = P * s - R * ((s - dec!(1)) / r);

    D.to_string()
}

#[wasm_bindgen]
pub fn calculate_time_to_pay_off(
    house_price: String,
    deposit: String,
    rate: String,
    PMT: String,
    overpayment: String,
) -> String {
    let house_price = Decimal::from_str(&house_price).unwrap();
    let deposit = Decimal::from_str(&deposit).unwrap();
    let rate = Decimal::from_str(&rate).unwrap();
    let PMT = Decimal::from_str(&PMT).unwrap();
    let overpayment = Decimal::from_str(&overpayment).unwrap();

    let PV = house_price - deposit;

    let APR = rate / dec!(100);

    let R = APR / dec!(12);

    let periods = -((dec!(1) - (PV * R) / (PMT + overpayment)).ln() / (dec!(1) + R).ln());

    periods.to_string()
}

#[wasm_bindgen]
pub fn calculate_amount_paid(PMT: String, overpayment: String, years: String) -> String {
    let PMT = Decimal::from_str(&PMT).unwrap();
    let overpayment = Decimal::from_str(&overpayment).unwrap();
    let years = Decimal::from_str(&years).unwrap();

    // "hello".to_string()

    ((PMT + overpayment) * (years * dec!(12))).to_string()
}
