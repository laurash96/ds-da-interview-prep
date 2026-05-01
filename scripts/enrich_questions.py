#!/usr/bin/env python3
"""
Enrich question banks: add Theory/Notes where missing, lengthen very short answers,
and append extra depth to shallow theory blocks — without changing ids, categories, or structure.
Run from repo root: python3 scripts/enrich_questions.py
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BANKS = ROOT / "data" / "banks"


def _clip(s: str, max_len: int = 100) -> str:
    s = " ".join(s.split())
    if len(s) <= max_len:
        return s
    return s[: max_len - 3].rstrip() + "..."


def _answer_fragment(answer: str, max_len: int = 140) -> str:
    """Snippet for theory text — avoids duplicated punctuation before suffix."""
    return _clip(answer, max_len).rstrip().rstrip(".").rstrip()


def theory_soft_skills(lang: str) -> str:
    if lang == "en":
        return (
            "- **Story arc (STAR)**: 1 sentence context → your responsibility → **2–3 actions you owned** "
            "(meetings, docs, code, data you pulled) → outcome with numbers or clear quality impact → **one lesson**.\n"
            "- **Make it concrete**: name a stakeholder role, a rough timeframe (“within two weeks”), and one artifact "
            "(PR, RFC, dashboard, retro notes).\n"
            "- **Tone**: accountable, curious, collaborative—show how you reduced ambiguity for others.\n"
            "- **If they probe**: what you’d do earlier next time (process, communication cadence, or validation step)."
        )
    return (
        "- **Arco STAR**: contexto en 1 frase → tu responsabilidad → **2–3 acciones tuyas** "
        "(reuniones, doc, código, datos que sacaste) → resultado (métrica o calidad) → **aprendizaje**.\n"
        "- **Anclajes concretos**: rol de stakeholder, ventana de tiempo aproximada (“en dos semanas”) y un artefacto "
        "(PR, RFC, dashboard, notas de retro).\n"
        "- **Tono**: responsabilidad, curiosidad, colaboración—cómo bajaste la ambigüedad para el equipo.\n"
        "- **Si profundizan**: qué harías antes la próxima vez (proceso, ritmo de comunicación o validación)."
    )


def theory_from_question(lang: str, category: str, question: str, answer: str) -> str:
    frag = _answer_fragment(answer, 140)
    if lang == "en":
        base = (
            f"- **How to expand this answer aloud**: Restate the core idea in plain language, then walk through **one mini-example** "
            f"(a table name, a metric, or a toy number) tied to: “{_clip(question, 70)}”.\n"
            f"- **Anchor your definition**: Summarize the core idea as: **{frag}** — then spell out **where it breaks** in real pipelines "
            "(skew, nulls, leakage, wrong grain, or stale dashboards).\n"
        )
        if category == "SQL":
            base += (
                "- **SQL interview angle**: Mention **indexes / EXPLAIN**, join cardinality, or whether you aggregate "
                "before joining to avoid double counting.\n"
                "- **Follow-up prep**: If they ask “show me a query”, sketch the `GROUP BY` grain and a sanity check "
                "(`COUNT(*)` vs `COUNT(DISTINCT user_id)`)."
            )
        elif category == "Python":
            base += (
                "- **Python angle**: connect to tests, readability, dtypes, and when **vectorized pandas** beats Python loops.\n"
                "- **Follow-up**: How you’d log inputs/outputs for debugging and guard against silent coercion."
            )
        elif category == "ML":
            base += (
                "- **ML angle**: name **train vs validation behavior**, a metric you’d track, and one regularization or "
                "data-quality knob you’d try first.\n"
                "- **Follow-up**: how you’d detect leakage and what baseline you’d compare against."
            )
        elif category == "Statistics":
            base += (
                "- **Stats angle**: assumptions (i.i.d., representativeness), **effect size vs p-values**, and what "
                "plot or diagnostic you’d look at first.\n"
                "- **Follow-up**: how changing sample size or variance would change your conclusion."
            )
        elif category == "Product":
            base += (
                "- **Product angle**: tie the idea to **users**, decisions, and trade-offs—what you’d measure before/after "
                "and which segment you’d inspect first.\n"
                "- **Follow-up**: guardrails, seasonality, and how you’d communicate uncertainty to PMs."
            )
        elif category == "GenAI":
            base += (
                "- **GenAI angle**: grounding (RAG), **evaluation** (golden set + safety), cost/latency, and when to "
                "prefer prompting vs fine-tuning.\n"
                "- **Follow-up**: hallucination mitigation and how you’d log prompts/responses responsibly."
            )
        else:
            base += (
                "- **General interview angle**: end with **how you’d validate** the idea on messy real data and what "
                "downstream decision it informs.\n"
                "- **Follow-up**: assumptions, alternatives, and how you’d communicate risk."
            )
        return base

    # Spanish
    base = (
        f"- **Cómo expandir en voz alta**: define en lenguaje claro y luego un **mini-ejemplo** "
        f"(tabla, métrica o número toy) ligado a: “{_clip(question, 70)}”.\n"
        f"- **Ancla tu definición**: resume la idea como: **{frag}** — y luego **dónde falla** en datos reales "
        f"(sesgo, nulos, leakage, grano incorrecto o dashboards desactualizados).\n"
    )
    if category == "SQL":
        base += (
            "- **Ángulo SQL**: índices / `EXPLAIN`, cardinalidad de joins, y si conviene **agregar antes de unir** "
            "para evitar doble conteo.\n"
            "- **Seguimiento**: grano del `GROUP BY` y chequeo `COUNT(*)` vs `COUNT(DISTINCT user_id)`."
        )
    elif category == "Python":
        base += (
            "- **Ángulo Python**: tests, legibilidad, dtypes y cuándo **vectorizar en pandas** vs loops.\n"
            "- **Seguimiento**: cómo loguearías entradas/salidas y evitar coerciones silenciosas."
        )
    elif category == "ML":
        base += (
            "- **Ángulo ML**: comportamiento **train vs validación**, métrica a vigilar y una palanca de "
            "regularización o calidad de datos.\n"
            "- **Seguimiento**: leakage y baseline de comparación."
        )
    elif category == "Statistics":
        base += (
            "- **Ángulo estadístico**: supuestos (i.i.d., representatividad), **tamaño de efecto vs p-value** y qué "
            "gráfico o diagnóstico mirarías primero.\n"
            "- **Seguimiento**: cómo cambian N o la varianza tu conclusión."
        )
    elif category == "Product":
        base += (
            "- **Ángulo producto**: usuarios, decisiones y trade-offs—qué medirías antes/después y qué segmento mirarías primero.\n"
            "- **Seguimiento**: guardrails, estacionalidad y cómo comunicar incertidumbre a PMs."
        )
    elif category == "GenAI":
        base += (
            "- **Ángulo GenAI**: grounding (RAG), **evaluación** (golden set + safety), costo/latencia y cuándo "
            "prompting vs fine-tuning.\n"
            "- **Seguimiento**: alucinaciones y logging responsable."
        )
    else:
        base += (
            "- **Ángulo general**: cómo **validarías** en datos reales y qué decisión aguas abajo informa.\n"
            "- **Seguimiento**: supuestos, alternativas y comunicación de riesgo."
        )
    return base


def deepen_theory_if_shallow(lang: str, category: str, theory: str) -> str:
    """Append one bullet when theory exists but is thin (e.g., some GenAI cards)."""
    if "**Practice drill**" in theory or "**Ejercicio rápido**" in theory or "**Depth add-on**" in theory:
        return theory
    if len(theory) >= 220:
        return theory
    if lang == "en":
        extra = (
            "\n- **Practice drill**: After answering, sketch **one validation step**—a query, a plot, a rubric item, "
            "or an A/B check—that would convince you the idea holds on real data."
        )
        if category == "GenAI":
            extra = (
                "\n- **Depth add-on**: Mention **grounding** (citations / retrieved docs), **evaluation harness** "
                "(golden questions + automatic graders), and how you’d monitor **cost, latency, and safety regressions**."
            ) + extra
    else:
        extra = (
            "\n- **Ejercicio rápido**: Tras responder, enuncia **un paso de validación**—query, gráfico, ítem de rúbrica "
            "o chequeo A/B—que te daría confianza en datos reales."
        )
        if category == "GenAI":
            extra = (
                "\n- **Más profundidad**: **grounding** (citas / docs recuperados), **harness de evaluación** "
                "(preguntas golden + graders automáticos) y monitoreo de **costo, latencia y regresiones de safety**."
            ) + extra
    return theory.rstrip() + extra


def expand_short_answer(lang: str, category: str, answer: str) -> str:
    """Only nudge very short technical answers; keep behavioral cards mostly unchanged."""
    if len(answer) >= 130 or category == "SoftSkills":
        return answer
    if lang == "en":
        extras = {
            "SQL": " Typical follow-ups: **NULL handling**, join fan-out, and whether filters should live in `WHERE` vs `HAVING` given your grain.",
            "Python": " Mention a **tiny concrete case** (e.g., tuple as dict key) and when mutability or hashing bites you in real code.",
            "ML": " Add **how you’d see it** in metrics (train vs validation gap, calibration, or error analysis on slices).",
            "Statistics": " Add **one bias source** (selection, non-compliance, peeking) and **one diagnostic** (plot, placebo check, or bootstrap).",
            "Product": " Tie it to **a decision** (ship vs iterate) and **which segment** you’d inspect first if the headline number moved.",
            "GenAI": " Mention **grounding**, **offline eval** (golden + rubric), and **online guardrails** (safety, cost, latency) when relevant.",
        }
        extra = extras.get(category, " Add **one validation step** you’d run on real data so the answer sounds operational, not textbook-only.")
        return answer.rstrip().rstrip(".") + "." + extra
    extras_es = {
        "SQL": " Seguimientos típicos: **NULLs**, fan-out de joins y si el filtro va en `WHERE` vs `HAVING` según el grano.",
        "Python": " Cita un **caso mínimo** (p. ej. tupla como clave de dict) y cuándo muerde la mutabilidad o el hashing.",
        "ML": " Añade **cómo lo verías** en métricas (gap train/val, calibración o análisis de error por segmentos).",
        "Statistics": " Suma **una fuente de sesgo** (selección, no cumplimiento, peeking) y **un diagnóstico** (gráfico, placebo, bootstrap).",
        "Product": " Líalo a una **decisión** (lanzar vs iterar) y al **segmento** que mirarías si cambia la métrica.",
        "GenAI": " Menciona **grounding**, **eval offline** (golden + rúbrica) y **guardrails online** (safety, costo, latencia) si aplica.",
    }
    extra = extras_es.get(category, " Añade **un paso de validación** en datos reales para que suene operativo, no solo libro.")
    return answer.rstrip().rstrip(".") + "." + extra


def enrich_item(item: dict) -> dict:
    category = item.get("category") or "General"

    for lang in ("en", "es"):
        key_a = f"answer_{lang}"
        key_t = f"theory_{lang}"
        key_q = f"question_{lang}"
        a = (item.get(key_a) or "").strip()
        q = (item.get(key_q) or "").strip()
        th = (item.get(key_t) or "").strip()

        if category == "SoftSkills":
            if not th:
                item[key_t] = theory_soft_skills(lang)
        else:
            if not th:
                item[key_t] = theory_from_question(lang, category, q, a)
            else:
                item[key_t] = deepen_theory_if_shallow(lang, category, th)

        item[key_a] = expand_short_answer(lang, category, item.get(key_a) or "")

    return item


def main() -> None:
    for path in sorted(BANKS.glob("*.json")):
        text = path.read_text(encoding="utf-8")
        data = json.loads(text)
        out = [enrich_item(dict(row)) for row in data]
        path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {path.relative_to(ROOT)} ({len(out)} cards)")


if __name__ == "__main__":
    main()
