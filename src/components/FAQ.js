import React from "react"


/** 
 * As a preface, there are a lot of information that we need to change on this as we learned more financial information along the way.
 * List of things to include or alter:
 * - Layered taxes
 * - Update understand on why we should switch
 *      - Leaving an account to grow and switching contribution etc
 *      - Example of dramatically shifting income resulting in b2b switching from roth and trad
 * - How we calculate contribution
 *      - focus on a pre-tax contribution
*/

function FAQ() {
    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
            {/* Retirement Tax Rate Explanation */}
            <div className="form-box" style={{ marginTop: "2rem" }}>
                <h3 style={{ textAlign: "center" }}>Understanding Retirement Tax Rate</h3>
                <fieldset>
                    <div style={{ padding: "1rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
                        <h4>What is "Retirement Tax Rate"?</h4>
                        <p>
                        <strong>It's NOT zero!</strong> In retirement, you still pay taxes on:
                        </p>
                        <ul style={{ paddingLeft: "1.5rem" }}>
                        <li>
                            <strong>Traditional IRA/401k withdrawals</strong> - This is your main retirement income!
                        </li>
                        <li>
                            <strong>Social Security</strong> - Up to 85% is taxable if your income is high enough
                        </li>
                        <li>
                            <strong>Pension income</strong> - Fully taxable
                        </li>
                        <li>
                            <strong>Investment income</strong> - Dividends, capital gains, rental income
                        </li>
                        <li>
                            <strong>Part-time work</strong> - If you work in retirement
                        </li>
                        </ul>

                        <h4 style={{ marginTop: "1rem" }}>Your Retirement Tax Calculation:</h4>
                        
                        {/*  
                        <div style={{ fontFamily: "monospace", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>
                        <div>IRA Withdrawals: ${desiredRetirementIncome.toLocaleString()}</div>
                        <div>Social Security (85% taxable): ${Math.round(socialSecurityIncome * 0.85).toLocaleString()}</div>
                        <div>Other Income: ${otherRetirementIncome.toLocaleString()}</div>
                        <div style={{ borderTop: "1px solid #ccc", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                            <strong>
                            Total Taxable Income: $
                            {(desiredRetirementIncome + socialSecurityIncome * 0.85 + otherRetirementIncome).toLocaleString()}
                            </strong>
                        </div>
                        <div>
                            <strong>Tax Bracket: {retirementTaxRate}%</strong>
                        </div>
                        </div>
                        */}

                        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
                        <strong>Key Insight:</strong> If your retirement tax rate {/* ({retirementTaxRate}%) */} is lower than your
                        current working tax rate, Traditional IRA will usually win. If it's higher, Roth IRA will usually win.
                        </p>
                    </div>
                </fieldset>
            </div>

            {/* Strategy Comparison Explanation */}
            <div className="form-box" style={{ marginTop: "2rem" }}>
                <h3 style={{ textAlign: "center" }}>Strategy Comparison: What's the Difference?</h3>
                <fieldset>
                <div className="recommendation-grid">
                    <div className="recommendation-section">
                    <h4 style={{ color: "#FF5733" }}>🔄 Switching Strategy</h4>
                    <ul style={{ paddingLeft: "1.5rem" }}>
                        <li>
                        <strong>One account at a time</strong>
                        </li>
                        <li>Puts 100% of contributions into whichever is optimal</li>
                        <li>Switches completely when tax situation changes</li>
                        <li>Example: Traditional until age 45, then switch to 100% Roth</li>
                        <li>
                        <strong>Pro:</strong> Always uses the "best" option
                        </li>
                        <li>
                        <strong>Con:</strong> All-or-nothing approach, no diversification
                        </li>
                    </ul>
                    </div>
                </div>

                <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
                    <h4>💡 Key Insight: Why Traditional Often Wins</h4>
                    <p>
                    If Traditional is always winning, it means your retirement tax rate {/*({retirementTaxRate}%)*/} is
                    significantly lower than your current working tax rates. This happens when:
                    </p>
                    <ul style={{ paddingLeft: "1.5rem" }}>
                    <li>You plan to withdraw less in retirement than you earn now</li>
                    <li>You expect to live in a lower-tax state in retirement</li>
                    <li>You have other tax-free income sources (like Roth 401k, HSA, etc.)</li>
                    </ul>
                    <p>
                    <strong>Try this:</strong> Increase your "Desired Annual Retirement Income" to see when Roth becomes
                    competitive!
                    </p>
                </div>
                </fieldset>
            </div>

            {/* Realistic Switching Thresholds Explanation */}
            <div className="form-box" style={{ marginTop: "2rem" }}>
                <h3 style={{ textAlign: "center" }}>Why Switching Rarely Happens in Real Life</h3>
                <fieldset>
                <div style={{ padding: "1rem", backgroundColor: "#fff8e1", borderRadius: "8px" }}>
                    <h4>🎯 Realistic Switching Thresholds:</h4>
                    <ul style={{ paddingLeft: "1.5rem" }}>
                    <li>
                        <strong>Traditional wins big:</strong> Current tax rate is 8+ points higher than retirement
                    </li>
                    <li>
                        <strong>Roth wins big:</strong> Retirement tax rate is 5+ points higher than current
                    </li>
                    <li>
                        <strong>Young person exception:</strong> Under 30, income {"<"}$60k, small tax difference → Roth
                    </li>
                    <li>
                        <strong>High earner exception:</strong> Income {">"}$120k, decent tax savings → Traditional
                    </li>
                    <li>
                        <strong>Default:</strong> Stick with current strategy (no switching for small differences)
                    </li>
                    </ul>

                    <h4 style={{ marginTop: "1rem" }}>💡 Why Small Tax Differences Don't Matter:</h4>
                    <div style={{ backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px", marginTop: "0.5rem" }}>
                    <p>
                        <strong>Example:</strong> 24% current vs 22% retirement (2% difference)
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem" }}>
                        <li>Traditional: Save 24% now, pay 22% later = 2% net benefit</li>
                        <li>Roth: Pay 24% now, save 22% later = 2% net cost</li>
                        <li>
                        <strong>Result:</strong> Only 2% difference over 30+ years!
                        </li>
                        <li>
                        <strong>Reality:</strong> Tax law changes, income varies, other factors matter more
                        </li>
                    </ul>
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>🔄 When Switching Actually Makes Sense:</h4>
                    <div style={{ backgroundColor: "#e8f5e9", padding: "1rem", borderRadius: "4px", marginTop: "0.5rem" }}>
                    <p>
                        <strong>Scenario 1:</strong> Young person gets big promotion
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem" }}>
                        <li>Age 25: $40k salary (12% tax) → Roth makes sense</li>
                        <li>Age 30: $100k salary (24% tax) → Switch to Traditional</li>
                        <li>
                        <strong>Tax difference:</strong> 12% difference justifies switching
                        </li>
                    </ul>

                    <p style={{ marginTop: "1rem" }}>
                        <strong>Scenario 2:</strong> Career with dramatic income growth (YOUR SITUATION!)
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem" }}>
                        <li>Early career: $50k-70k salary (12-22% tax) → Start with Roth</li>
                        <li>Mid career: $120k+ salary (24-32% tax) → Switch to Traditional</li>
                        <li>Peak career: $200k+ salary (35% tax) → Definitely Traditional</li>
                        <li>
                        <strong>Why this works:</strong> Pay low taxes early (Roth), avoid high taxes later (Traditional)
                        </li>
                    </ul>

                    <p style={{ marginTop: "1rem" }}>
                        <strong>Scenario 3:</strong> High earner planning expensive retirement
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem" }}>
                        <li>Working: $150k salary (32% tax) → Traditional makes sense</li>
                        <li>Retirement: $120k withdrawals (24% tax) → 8% difference, Traditional wins</li>
                        <li>But if planning $200k retirement: (35% tax) → Should have done Roth!</li>
                    </ul>

                    <p style={{ marginTop: "1rem" }}>
                        <strong>Scenario 4:</strong> Professional/Business owner trajectory
                    </p>
                    <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem" }}>
                        <li>Resident/Student: $30k income (12% tax) → Roth is perfect</li>
                        <li>Early practice: $80k income (22% tax) → Still favor Roth</li>
                        <li>Established practice: $300k+ income (35% tax) → Switch to Traditional</li>
                        <li>
                        <strong>Result:</strong> Roth money grows tax-free for decades, Traditional saves huge taxes at peak
                        earnings
                        </li>
                    </ul>
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>💡 The "Income Growth" Strategy:</h4>
                    <div style={{ backgroundColor: "#fff3e0", padding: "1rem", borderRadius: "4px", marginTop: "0.5rem" }}>
                    <p>
                        <strong>If you expect your income to grow dramatically:</strong>
                    </p>
                    <ul style={{ paddingLeft: "1.5rem" }}>
                        <li>
                        <strong>Start with Roth</strong> when income is low (pay taxes at low rates)
                        </li>
                        <li>
                        <strong>Switch to Traditional</strong> when income gets high (avoid taxes at high rates)
                        </li>
                    </ul>

                    <p style={{ marginTop: "1rem", fontSize: "0.9rem", fontStyle: "italic" }}>
                        This is why the calculator shows switching for dramatic income growth scenarios - it's actually a very
                        smart strategy!
                    </p>
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>🚀 Test Your Career Growth Scenario:</h4>
                    <div style={{ backgroundColor: "#f3e5f5", padding: "1rem", borderRadius: "4px", marginTop: "0.5rem" }}>
                    <p>
                        <strong>Try this to see switching in action:</strong>
                    </p>
                    <ol style={{ paddingLeft: "1.5rem" }}>
                        <li>Set current age to 25</li>
                        <li>Set current salary to $45,000 (12% tax bracket)</li>
                        <li>Set salary growth to 6-8% (aggressive career growth)</li>
                        <li>Set desired retirement income to $80,000</li>
                        <li>Watch the switching strategy outperform!</li>
                    </ol>

                    <p style={{ marginTop: "1rem" }}>
                        <strong>What you'll see:</strong> Start with Roth (low taxes), switch to Traditional around age 35-40
                        when salary hits $100k+ (high taxes).
                    </p>

                    <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
                        This mirrors real career paths for doctors, lawyers, engineers, business owners, and other professionals
                        with steep income growth curves.
                    </p>
                    </div>
                </div>
                </fieldset>
            </div>
        </div>
    )
}

export default FAQ