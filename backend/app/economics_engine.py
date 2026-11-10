from typing import Dict, Any, List

def calculate_comprehensive_economics(
    crop_name: str,
    area_hectares: float = 2.0,
    expected_yield_t_ha: float = 3.6,
    selling_price_per_ton_inr: float = 38000.0,
    seed_cost_inr: float = 4000.0,
    fertilizer_cost_inr: float = 9500.0,
    pesticide_cost_inr: float = 3800.0,
    labour_cost_inr: float = 18000.0,
    irrigation_power_cost_inr: float = 4200.0,
    machinery_tractor_cost_inr: float = 8500.0,
    harvesting_cost_inr: float = 7500.0,
    packaging_bags_cost_inr: float = 2800.0,
    storage_cost_inr: float = 2200.0,
    transport_cost_inr: float = 3500.0,
    mandi_commission_pct: float = 1.5
) -> Dict[str, Any]:
    """
    Transparent agricultural economics engine with traceable formulas:
    - Total Cost = sum of all input & operational line items
    - Gross Revenue = (Yield per Ha * Area in Ha) * Selling Price per Ton
    - Net Profit = Gross Revenue - (Total Cost + Mandi Commission)
    - Profit per Acre = Net Profit / (Area in Ha * 2.47105)
    - Break-even Price = Total Costs / Total Yield
    """
    area_acres = area_hectares * 2.47105

    # Direct line items
    base_operational_cost = (
        seed_cost_inr +
        fertilizer_cost_inr +
        pesticide_cost_inr +
        labour_cost_inr +
        irrigation_power_cost_inr +
        machinery_tractor_cost_inr +
        harvesting_cost_inr +
        packaging_bags_cost_inr +
        storage_cost_inr +
        transport_cost_inr
    )

    total_yield_tonnes = expected_yield_t_ha * area_hectares
    total_yield_quintals = total_yield_tonnes * 10.0

    gross_revenue = total_yield_tonnes * selling_price_per_ton_inr
    mandi_commission_inr = gross_revenue * (mandi_commission_pct / 100.0)
    total_cost_overall = base_operational_cost + mandi_commission_inr

    net_profit = gross_revenue - total_cost_overall
    profit_per_ha = net_profit / area_hectares if area_hectares > 0 else 0.0
    profit_per_acre = net_profit / area_acres if area_acres > 0 else 0.0
    cost_per_ha = total_cost_overall / area_hectares if area_hectares > 0 else 0.0

    # Break-even price per quintal
    breakeven_price_per_qtl = (total_cost_overall / total_yield_quintals) if total_yield_quintals > 0 else 0.0
    breakeven_price_per_ton = (total_cost_overall / total_yield_tonnes) if total_yield_tonnes > 0 else 0.0
    roi_pct = ((net_profit / total_cost_overall) * 100.0) if total_cost_overall > 0 else 0.0

    # 3 Sensitivity Scenarios (Optimistic, Expected, Pessimistic)
    # 1. Optimistic (+15% yield, +10% price)
    opt_yield = total_yield_tonnes * 1.15
    opt_price = selling_price_per_ton_inr * 1.10
    opt_gross = opt_yield * opt_price
    opt_commission = opt_gross * (mandi_commission_pct / 100.0)
    opt_net = opt_gross - (base_operational_cost + opt_commission)

    # 2. Pessimistic (-20% yield, -15% price)
    pess_yield = total_yield_tonnes * 0.80
    pess_price = selling_price_per_ton_inr * 0.85
    pess_gross = pess_yield * pess_price
    pess_commission = pess_gross * (mandi_commission_pct / 100.0)
    pess_net = pess_gross - (base_operational_cost + pess_commission)

    return {
        "crop_name": crop_name,
        "area_hectares": round(area_hectares, 2),
        "area_acres": round(area_acres, 2),
        "yield_parameters": {
            "expected_yield_t_ha": round(expected_yield_t_ha, 2),
            "total_yield_tonnes": round(total_yield_tonnes, 2),
            "total_yield_quintals": round(total_yield_quintals, 1)
        },
        "price_parameters": {
            "selling_price_per_ton_inr": round(selling_price_per_ton_inr),
            "selling_price_per_qtl_inr": round(selling_price_per_ton_inr / 10.0, 1)
        },
        "itemized_expenses_inr": {
            "seed_planting_material": round(seed_cost_inr),
            "fertilizer_nutrients": round(fertilizer_cost_inr),
            "plant_protection_pesticides": round(pesticide_cost_inr),
            "field_labour": round(labour_cost_inr),
            "irrigation_and_power": round(irrigation_power_cost_inr),
            "machinery_and_tractor": round(machinery_tractor_cost_inr),
            "harvesting_expenses": round(harvesting_cost_inr),
            "packaging_and_gunny_bags": round(packaging_bags_cost_inr),
            "storage_charges": round(storage_cost_inr),
            "freight_transport": round(transport_cost_inr),
            "mandi_cess_and_commission": round(mandi_commission_inr)
        },
        "summary": {
            "total_cultivation_cost_inr": round(total_cost_overall),
            "gross_revenue_inr": round(gross_revenue),
            "net_profit_inr": round(net_profit),
            "profit_per_hectare_inr": round(profit_per_ha),
            "profit_per_acre_inr": round(profit_per_acre),
            "cost_per_hectare_inr": round(cost_per_ha),
            "breakeven_price_per_qtl_inr": round(breakeven_price_per_qtl, 1),
            "breakeven_price_per_ton_inr": round(breakeven_price_per_ton, 1),
            "return_on_investment_pct": round(roi_pct, 1)
        },
        "scenarios": {
            "optimistic": {
                "label": "Favorable Monsoon & Festival High (+15% Yield, +10% Price)",
                "gross_revenue_inr": round(opt_gross),
                "net_profit_inr": round(opt_net),
                "profit_per_acre_inr": round(opt_net / area_acres if area_acres > 0 else 0)
            },
            "expected": {
                "label": "Baseline Agronomic Outcome",
                "gross_revenue_inr": round(gross_revenue),
                "net_profit_inr": round(net_profit),
                "profit_per_acre_inr": round(profit_per_acre)
            },
            "pessimistic": {
                "label": "Heatwave / Pest Surge (-20% Yield, -15% Price)",
                "gross_revenue_inr": round(pess_gross),
                "net_profit_inr": round(pess_net),
                "profit_per_acre_inr": round(pess_net / area_acres if area_acres > 0 else 0)
            }
        },
        "traceable_formula": "Net Profit = (Yield × Area × Price) - (Sum of Direct Input Expenses + Mandi Cess)"
    }
