---
title: "Production Management"
subject: uretim-yonetimi
state: draft
subtopics:
  - Production systems and types
  - Plant location and facility layout
  - Demand forecasting and capacity planning
  - Inventory management
  - Material requirements planning and just-in-time production
  - Quality management
  - Work study and project planning
keyConcepts: [job-shop production, continuous production, product layout, process layout, fixed-position layout, Delphi method, exponential smoothing, economic order quantity, ABC analysis, safety stock, MRP, just-in-time (JIT), Kanban, total quality management, PDCA cycle, CPM and PERT]
questionStyle: "Recognising a production or layout type from its features; doing simple calculations such as the economic order quantity; telling apart the basic principles of JIT, MRP and quality approaches"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Production management is the **planning, organising and control** of the process that turns inputs (raw materials, labour, machines, information) into goods and services. The aim is to produce the right amount, at the right quality, at the right time and at the lowest cost. The test has **10 questions**; they cover recognising production and layout types, inventory and forecasting calculations, and the principles of JIT and quality approaches.

## Production systems

- **Job-shop production** (*sipariş tipi*): small quantities of varied products to customer order; general-purpose machines and skilled workers.
- **Batch production** (*parti üretim*): set quantities produced intermittently; machines are reset between batches.
- **Mass and continuous (flow) production:** standard products, high volume, special-purpose machines; refineries and cement plants are continuous.
- **Project production:** one-off large jobs such as bridges, ships and dams.

## Location and facility layout

- **Plant location** depends on market, raw materials, labour, energy, transport and incentives; weighted scoring and break-even analysis are used.
- **Product (line) layout:** machines are arranged in the order of operations; suits mass production and requires **line balancing**.
- **Process (functional) layout:** similar machines are grouped in one department; suits job-shop production.
- **Fixed-position layout:** the product stays put and resources come to it (ships, aircraft).
- **Cellular layout (group technology):** machine cells are formed for families of similar parts.

## Forecasting and inventory

- **Demand forecasting:** qualitative methods (expert opinion, **Delphi**: anonymous, repeated rounds of expert opinion) and quantitative methods (**moving average**, **exponential smoothing**, regression).
- **Economic order quantity (EOQ):** the quantity that minimises total ordering plus holding cost: EOQ = sqrt(2DS / H), where D is annual demand, S the cost per order and H the annual holding cost per unit.
- **Reorder point:** daily usage × lead time (+ safety stock).
- **ABC analysis:** group A is a few items with the highest value and gets the tightest control; group C is many low-value items.

## Modern production approaches

- **MRP (material requirements planning):** uses the master production schedule, bill of materials and inventory records to work out when and how much of each dependent-demand item is needed. **ERP** extends this to all business functions.
- **Just-in-time (JIT):** producing only what is needed, when it is needed; inventory is treated as waste. A pull system runs on **Kanban** cards.
- **Lean production:** eliminating waste such as overproduction, waiting, transport, inventory, unnecessary motion and defects.

## Quality and work planning

- **Total quality management:** customer focus, continuous improvement (**kaizen**), involvement of all employees.
- **PDCA (Deming) cycle** (*PUKÖ*): Plan, Do, Check, Act.
- **Six Sigma:** cutting defects to a very low level by reducing process variation. **Control charts** track whether a process stays within control limits.
- **Work study:** **method study** finds the best way to do a job; **work measurement** sets the standard time.
- **Project planning:** **CPM** uses fixed activity times to find the **critical path** (the longest path; any delay on it delays the project); **PERT** uses optimistic, most likely and pessimistic times to compute the expected time (a + 4m + b) / 6. A **Gantt chart** shows tasks as bars against time.

## Commonly confused

- *Product layout* suits mass production; *process layout* suits job-shop production.
- *MRP* pushes production according to a plan; *JIT* pulls it according to demand.
- *CPM* uses fixed times; *PERT* uses probabilistic times.

## Study tip

Work through one small example each for EOQ, the reorder point and the PERT expected time; numerical questions usually come from these three. For verbal questions, think of production type and layout type as a matched pair.
