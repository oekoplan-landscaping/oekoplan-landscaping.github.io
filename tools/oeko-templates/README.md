# Ökoplan offer and agreement templates

`src/` holds the two Word files of the office as they were given (16 Nov 2026):
«Technical and Financial Offer Rev 0» and «Consultancy Agreement».

`make_offer.py` and `make_agr.py` turn them into the fillable templates the app uses
(`app/_src/tpl/offer.docx`, `app/_src/tpl/agreement.docx`): every variable part becomes a
`{tag}` that `app/_src/okdocx.js` fills (docxtemplater, MIT). To change the standard text,
edit the Word file in `src/`, then run from this folder:

    pip install lxml
    python3 make_offer.py && python3 make_agr.py

and bump the app build.
