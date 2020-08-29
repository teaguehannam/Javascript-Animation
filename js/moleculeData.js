
var ESSENTIAL = {
	0: { "Histidine": "./aminos/essential/histidine.pdb" },
	1: { "Isoleucine": "./aminos/essential/isoleucine.pdb" },
	2: { "Leucine": "./aminos/essential/leucine.pdb" },
	3: { "Lysine": "./aminos/essential/lysine.pdb" },
	4: { "Methionine": "./aminos/essential/methionine.pdb" },
	5: { "Phenylalanine": "./aminos/essential/phenylalanine.pdb" },
	6: { "Threonine": "./aminos/essential/threonine.pdb" },
	7: { "Tryptophan": "./aminos/essential/tryptophan.pdb" },
	8: { "Valine": "./aminos/essential/valine.pdb" }
};

var NONESSENTIAL = {
	0: { "Alanine": "./aminos/non-essential/alanine.pdb" },
	1: { "Arginine": "./aminos/non-essential/arginine.pdb" },
	2: { "Asparagine": "./aminos/non-essential/asparagine.pdb" },
	3: { "Aspartic Acid": "./aminos/non-essential/aspartic_acid.pdb" },
	4: { "Glutamic Acid": "./aminos/non-essential/glutamic_acid.pdb" },
	5: { "Taurine": "./aminos/non-essential/taurine.pdb" },
	6: { "Tyrosine": "./aminos/non-essential/tyrosine.pdb" }
};

var CONDITIONAL = {
	0: { "Arginine*": "./aminos/non-essential/arginine.pdb" },
	1: { "Cysteine": "./aminos/conditional/cysteine.pdb" },
	2: { "Glutamine": "./aminos/conditional/glutamine.pdb" },
	3: { "Glycine": "./aminos/conditional/glycine.pdb" },
	4: { "Ornithine": "./aminos/conditional/ornithine.pdb" },
	5: { "Proline": "./aminos/conditional/proline.pdb" },
	6: { "Serine": "./aminos/conditional/serine.pdb" },
	7: { "Tyrosine*": "./aminos/non-essential/tyrosine.pdb" }
};

var VITAMINS = {
	0: { "Biotin": "./vitamins/biotin.pdb" },
	1: { "Choline": "./vitamins/choline.pdb" },
	2: { "Elatin": "./vitamins/elatin.pdb" },
	3: { "Folic Acid": "./vitamins/folic acid.pdb" },
	4: { "Inositol": "./vitamins/inositol.pdb" },
	5: { "Vitamin A": "./vitamins/vitamin a.pdb" },
	6: { "Vitamin B1": "./vitamins/vitamin b1.pdb" },
	7: { "Vitamin B2": "./vitamins/vitamin b2.pdb" },
	8: { "Vitamin B3 (Niacinamide)": "./vitamins/vitamin b3 niacinamide.pdb" },
	9: { "Vitamin B3 (Nicotinic Acid)": "./vitamins/vitamin b3 nicotinic acid.pdb" },
	10: { "Vitamin B5": "./vitamins/vitamin b5.pdb" },
	11: { "Vitamin B6": "./vitamins/vitamin b6.pdb" },
	// "Vitamin B12": "./vitamins/vitamin b12.pdb",
	12: { "Vitamin C": "./vitamins/vitamin c.pdb" },
	13: { "Vitamin D": "./vitamins/vitamin d.pdb" },
	14: { "Vitamin E": "./vitamins/vitamin e.pdb" },
	15: { "Vitamin K": "./vitamins/vitamin k.pdb" }
};

export const MOLECULES = [ESSENTIAL, NONESSENTIAL, CONDITIONAL, VITAMINS];
