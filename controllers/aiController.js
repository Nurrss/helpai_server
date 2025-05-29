const { floor } = require("lodash");
const Exam = require("../models/Exams");
const mongoose = require("mongoose");

exports.fetchResultsForSubmission = async (req, res, next) => {
  const { examId, submissionId } = req.params;

  try {
    const exam = await Exam.findById(examId).populate("submissions.user");
    const submission = exam.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).send("Submission not found");
    }

    const results = exam.words.map((word, index) => {
      return {
        word: word,
        spokenWord: submission.spokenWords[index] || "No word spoken",
      };
    });

    req.results = results;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
