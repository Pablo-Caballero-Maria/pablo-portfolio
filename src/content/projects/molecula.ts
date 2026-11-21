/** Predicting molecular bioactivity (sources: the README and the coursework report). */
import type { Project } from "./types";

export const molecula: Project = {
  slug: "molecular-activity",
  name: "Molecular activity prediction",
  kind: "Cheminformatics & ML · Master's coursework",
  year: "2026",
  tagline:
    "Is this compound active? Seven classifiers, Optuna, SHAP and similarity search over molecular fingerprints stored in MongoDB.",
  summary:
    "Coursework for the Master's in Computational Intelligence and IoT at the University of Córdoba. It maps a classic entity–relationship schema to validated MongoDB collections, then predicts which compounds are biologically active from 1024-bit fingerprints, testing noise, outliers, feature selection, RDKit descriptors and SHAP explanations.",
  hue: "molecula",
  deployment: { kind: "local", note: "Runs locally: Python scripts against a local MongoDB server" },
  repository: "https://github.com/Pablo-Caballero-Maria/trabajo_molecula",
  cover: {
    src: "/img/projects/molecula-cover.webp",
    alt: "SHAP beeswarm plot: how much each fingerprint bit pushes a molecule towards active or inactive",
    width: 1200,
    height: 750,
  },
  highlights: [
    { value: "0.669", label: "GMean on the held-out test set (AUROC 0.723)" },
    { value: "7,015", label: "molecules in the larger database" },
    { value: "7", label: "classifiers compared with repeated CV" },
  ],
  stack: [
    "Python 3.14",
    "scikit-learn",
    "Optuna",
    "SHAP",
    "RDKit",
    "MongoDB",
    "Plotly",
    "pytest",
    "uv · ruff · ty",
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "paragraph",
          text: "Practical work for *Analysis, Design and Processing of Data Applied to Science and Technology* (ADP). It has two phases and an extension: a NoSQL design in MongoDB, a study of how well machine learning predicts the biological activity of compounds, and a similarity search that reuses the same database structures.",
        },
      ],
    },
    {
      id: "mongodb",
      title: "Phase 1 · From an ER schema to MongoDB",
      blocks: [
        {
          kind: "paragraph",
          text: "The classic DEPT/EMP schema has a 1:N relationship (a department has employees) and a reflexive one (an employee manages others). MongoDB can embed employees inside their department or reference them from a separate collection; I chose **references**, for three reasons:",
        },
        {
          kind: "steps",
          items: [
            "Employees have their own identity: `EMPNO` is a key and several reports query them directly.",
            "The management relationship crosses departments: BLAKE manages people in department 30, but his own manager, KING, is in department 10. Embedded employees could not resolve that inside one document.",
            "Minimum cardinalities of 0 (employees without a department, departments without employees) are just a missing `deptno` field, whereas embedding would need a fake department.",
          ],
        },
        {
          kind: "paragraph",
          text: "Both collections are created with strict `$jsonSchema` validation (types, required fields, ranges, `additionalProperties: false`), use the natural keys as `_id`, and get secondary indexes on `deptno`, `mgr` and `job`. Eleven reports exercise the aggregation framework: `$lookup` joins, the full four-level hierarchy with `$graphLookup`, business summaries, edge cases and an `updateMany` with a pipeline.",
        },
      ],
    },
    {
      id: "classification",
      title: "Phase 2 · Predicting biological activity",
      blocks: [
        {
          kind: "paragraph",
          text: "Two databases store each molecule's SMILES, its class (active or inactive) and its Morgan fingerprint as the positions of its 1-bits, from which the feature matrix is rebuilt. **CDS16** has 82 molecules, perfectly balanced; **CDS29** has 7,015, of which only 19.6 % are active, the usual imbalance in virtual screening.",
        },
        {
          kind: "list",
          items: [
            "Seven classifiers: logistic regression, an RBF SVM, k-NN with Jaccard distance, Bernoulli naive Bayes, random forest, extra trees and an MLP, all evaluated with **repeated stratified cross-validation**.",
            "Metrics that survive imbalance: GMean, Cohen's kappa and AUROC. Accuracy misleads here: on CDS29 the random forest has the best accuracy (0.802) but finds only 14.7 % of the active molecules.",
            "Hyperparameters tuned with **Optuna** (TPE with median pruning) on an 80/20 stratified split of CDS29, with the test set kept for one final measurement.",
          ],
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/molecula-cv-models.webp",
            alt: "Dot plot of mean GMean and AUROC with error bars for seven classifiers on CDS16 and CDS29",
            width: 1600,
            height: 750,
            caption:
              "Mean GMean and AUROC (± one standard deviation) of the seven classifiers. On the small CDS16 the intervals overlap almost completely; on CDS29 every model drops, and the differences become significant.",
          },
        },
        {
          kind: "table",
          caption: "Best model per database in cross-validation.",
          head: ["Database", "Best by GMean", "GMean", "AUROC"],
          rows: [
            ["CDS16 (82 molecules)", "Random forest", "0.881", "0.959"],
            ["CDS29 (7,015 molecules)", "SVM (RBF)", "0.643", "0.720"],
          ],
        },
      ],
    },
    {
      id: "robustness",
      title: "Noise, selection and feature engineering",
      blocks: [
        {
          kind: "list",
          items: [
            "**Noise × outliers**: twelve combinations of outlier removal (Isolation Forest, LOF with Jaccard distance) and noise injection (Gaussian, bit flips, masking), all fitted inside each fold. None changes the result clearly (GMean 0.610–0.630): in a chemically diverse set, rare molecules are not errors but part of the space the model must cover.",
            "**Feature selection**: five criteria from three families (filter, embedded, wrapper) show the fingerprint can be cut to **256 of its 1024 bits** with no measurable loss, and that no criterion dominates.",
            "**Feature engineering with RDKit**: substructure counts, 217 physico-chemical descriptors, the 167 MACCS keys and five similarity features. Only similarity helps: bits plus similarity take logistic regression to **GMean 0.669 and AUROC 0.723** on the test set, the best result of the whole study.",
          ],
        },
      ],
    },
    {
      id: "shap",
      title: "Explainability with SHAP",
      blocks: [
        {
          kind: "paragraph",
          text: "An exact `TreeExplainer` on the tuned random forest gives every bit's contribution to each test molecule's probability of being active. The contributions add up to the predicted probability with a maximum error of 1e-9.",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/molecula-shap.webp",
            alt: "SHAP beeswarm of the fifteen most important fingerprint bits",
            width: 1400,
            height: 1116,
            caption:
              "Each dot is a test molecule; purple means the bit is present. FP98 and FP111 push strongly towards *active* (45–48 % of the molecules that have them are active, against 19.6 % overall), while FP831 pushes towards *inactive*.",
          },
        },
      ],
    },
    {
      id: "screening",
      title: "Extension · Virtual screening by similarity",
      blocks: [
        {
          kind: "paragraph",
          text: "A Tanimoto similarity search written as an aggregation pipeline, compared with an exhaustive scan. Two exact filters run before the similarity itself: a bound on the number of 1-bits (a candidate needs between T·Nₐ and Nₐ/T) and a set of the query's rarest bits, of which a candidate must share at least one (that is what the `mfp_counts` collection is for).",
        },
        {
          kind: "list",
          items: [
            "The pipeline returned exactly the same molecules as the exhaustive scan in all eight cases (two databases × four thresholds).",
            "On CDS29 with T = 0.8 it evaluates only **5.8 %** of the molecules and answers in 7.1 ms instead of 68.1 ms; at T = 0.3 the filters let 72 % through and the advantage disappears.",
          ],
        },
        {
          kind: "callout",
          title: "Takeaway",
          text: "The quality of a QSAR model depends far more on the data than on the algorithm: seven classifiers fit within a few hundredths on CDS16, and all of them drop on CDS29. The right metric, stratification, repetition and an untouched test set are what make an estimate credible.",
        },
      ],
    },
    {
      id: "reproducibility",
      title: "Reproducible and tested",
      blocks: [
        {
          kind: "paragraph",
          text: "**74 pytest tests** check the work. 48 unit tests cover the metrics, the models and their Optuna search spaces, the noise and outlier detectors, Tanimoto similarity, feature selection and the figures; 26 integration tests restore CDS16 and CDS29 from the course's backup into a temporary MongoDB, reading the BSON directly so `mongorestore` isn't needed, and check that the scripts reproduce what was handed in.",
        },
        {
          kind: "list",
          items: [
            "Phase 1 prints its eleven reports byte for byte as in `fase1_salida.txt`, and the schema rejects every kind of invalid document.",
            "The random forest rebuilt from Optuna's best parameters gives exactly the delivered test GMean (0.632) and AUROC (0.717).",
            "RDKit's Morgan fingerprints match the stored bits, and the similarity pipeline returns the same molecules as the exhaustive scan.",
            "GitHub Actions runs Ruff, ty and the tests with coverage against a MongoDB 8 service on every push, alongside CodeQL and Dependabot.",
          ],
        },
      ],
    },
  ],
};
