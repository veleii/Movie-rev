import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Ogiltig e-postadress"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  } /* Marias tillsnyggningsgrej */,
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false, // versionKey ser ut såhär: _v: 9843543ndfsi7984nlkd9823. här säger man att den inte ska skickas med i ett api-anrop
      transform: (_, ret) => {
        //ändrar mongoDBs id från: _id --> id. (ret.id står får return id)
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Pre-save hook för att hasha lösenordet innan det sparas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
