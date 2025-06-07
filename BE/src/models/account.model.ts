import mongoose, { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface AccountDocument extends mongoose.Document {
    Address: string;
    Signature: string;
    isAdmin: boolean;
    refreshToken: string;
}

const accountSchema = new mongoose.Schema<AccountDocument>({
    Address: {
        type: String,
        required: true,
    },
    Signature: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

accountSchema.plugin(mongoosePaginate);
const AccountModel = mongoose.model<AccountDocument, PaginateModel<AccountDocument>>(
    'Account',
    accountSchema
);

export default AccountModel;